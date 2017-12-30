const https = require('https');
const querystring = require('querystring');
const AWS = require('aws-sdk');

function sendEmail(body, callback) {
  const sesClient = new AWS.SES();

  const mailParams = {
    Destination: {
      ToAddresses: ['test@hovalabs.com'],
    },
    Message: {
      Body: {
        Html: {
          Data: `<p>${body.bodyData}</p>`,
        },
        Text: {
          Data: `${body.bodyData}`,
        },
      },
      Subject: {
        Data: body.subjectdata,
      },
    },
    Source: 'test@hovalabs.com',
    ReplyToAddresses: body.replyToAddresses,
  };

  sesClient.sendEmail(mailParams, (emailError, data) => {
    if (emailError) {
      callback({ error: emailError }, null);
    } else {
      callback(null, { success: true });
    }
  });
}

const ReCaptcha = function ReCaptcha(siteKey, secretKey) {
  this.site_key = siteKey;
  this.secret_key = secretKey;
  return this;
};

ReCaptcha.prototype.verify = function verify(code, callback) {
  let err = '';
  const data = {
    response: code,
    secret: this.secret_key,
  };

  // Request validation
  if (!('response' in data && 'secret' in data)) {
    err = 'invalid-input-response';
    return callback(err);
  }
  if (data.response === '') {
    err = 'missing-input-response';
    return callback(err);
  }
  if (data.secret === '') {
    err = 'missing-input-secret';
    return callback(err);
  }

  const dataQs = querystring.stringify(data);

  const reqOptions = {
    host: 'www.google.com',
    path: '/recaptcha/api/siteverify',
    port: 443,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': dataQs.length,
    },
  };

  const request = https.request(reqOptions, (response) => {
    let body = '';

    response.on('error', (responseError) => {
      request.end();
      callback(responseError);
    });

    response.on('data', (chunk) => {
      body += chunk;
    });

    response.on('end', () => {
      try {
        body = JSON.parse(body);
        callback(body['error-codes'], body.success);
      } catch (e) {
        callback(e);
      }
    });
  });
  request.write(dataQs, 'utf8');
  request.end();
};

// Run params through ReCaptcha
// Send the email
exports.handler = (event, context, callback) => {
  try {
    // Body params sent to API Gateway
    const body = JSON.parse(event.body);

    const response = body.captchaResponse;
    const key = process.env.RECAPTCHA_KEY;
    const secret = process.env.RECAPTCHA_SECRET;
    const dataToSend = { secret, response };
    const recap = new ReCaptcha(key, secret, dataToSend);

    // To prevent reply error
    // Need to maintain standard json format, including
    // isBase64Encoded: true|false
    // statusCode
    // body: a JSON String
    // headers: Be sure to include CORS headers. NOTE must be redundant and match API Gateway CORS
    const reply = {
      isBase64Encoded: false,
      statusCode: 200,
      body: '',
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };

    recap.verify(response, (recapError, success) => {
      if (recapError) {
        throw new Error(recapError);
      }

      sendEmail(body, (emailError, data) => {
        if (emailError) {
          throw new Error(emailError);
        }

        reply.body = JSON.stringify({ success: true });
        callback(null, reply);
      });
    });
  } catch (ex) {
    const reply = {
      isBase64Encoded: false,
      statusCode: 200,
      body: JSON.stringify({ error: ex }),
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
    callback(null, reply);
  }
};
