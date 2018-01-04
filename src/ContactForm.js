import React from 'react';
import autobind from 'react-autobind';
import ReCAPTCHA from 'react-google-recaptcha';
import SimpleSchema from 'simpl-schema';

export default class ContactForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      validName: false,
      email: '',
      validEmail: false,
      message: '',
      validMessage: false,
      sendStatus: 'Submit',
      captchaResponse: '',
    };

    autobind(this);
  }

  storeCaptcha(captchaValue) {
    this.setState({ captchaResponse: captchaValue });
  }

  storeName(e) {
    const name = e.target.value;
    let validName = true;

    const nameSchema = new SimpleSchema({
      name: {
        type: String,
        min: 1,
        max: 100,
      },
    });

    try {
      nameSchema.validate({ name });
    } catch (ex) {
      validName = false;
    }

    this.setState({ name, validName });
  }

  storeEmail(e) {
    const email = e.target.value;
    let validEmail = true;

    const emailSchema = new SimpleSchema({
      email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
      },
    });

    try {
      emailSchema.validate({ email });
    } catch (ex) {
      validEmail = false;
    }

    this.setState({ email, validEmail });
  }

  storeMessage(e) {
    const message = e.target.value.substring(0, 500);
    let validMessage = true;

    const messageSchema = new SimpleSchema({
      message: {
        type: String,
        min: 1,
        max: 500,
      },
    });

    try {
      messageSchema.validate({ message });
    } catch (ex) {
      validMessage = false;
    }

    this.setState({ message, validMessage });
  }

  sendSupportRequest(e) {
    e.preventDefault();

    this.setState({ sendStatus: 'Sending...' });

    fetch('https://92kcwq3cr3.execute-api.us-west-2.amazonaws.com/prod/umarc-email', {
      credentials: 'omit',
      mode: 'cors',
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        captchaResponse: this.state.captchaResponse,
        toEmailAddresses: ['test@hovalabs.com'],
        bodyData: this.state.message,
        bodyCharset: 'UTF-8',
        subjectdata: `UMarc Contact: ${this.state.name}`,
        subjectCharset: 'UTF-8',
        sourceEmail: 'test@hovalabs.com',
        replyToAddresses: [this.state.email],
      }),
    })
      .then((res) => {
        if (res.status !== 200) {
          this.setState({ sendStatus: 'Error sending message' });
        }
        return res.json();
      })
      .then((json) => {
        this.setState({ sendStatus: 'Message Sent' });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  render() {
    return (
      <div id="contact">
        <form onSubmit={this.sendSupportRequest}>
          <div className="container">
            <h1>Contact Us</h1>
            <div className="row">
              <div className="col-12 col-md-6">
                <label>Name</label>
                <input
                  style={this.state.validName ? {} : { background: '#ffaaaa' }}
                  onChange={this.storeName}
                  type="text"
                  placeholder="Name here"
                />
              </div>
              <div className="col-12 col-md-6">
                <label>Email</label>
                <input
                  style={this.state.validEmail ? {} : { background: '#ffaaaa' }}
                  onChange={this.storeEmail}
                  type="text"
                  placeholder="Email here"
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label>Message</label>
                <textarea
                  style={this.state.validMessage ? {} : { background: '#ffaaaa' }}
                  onChange={this.storeMessage}
                  placeholder="Type here"
                />
              </div>
            </div>
            <div id="recaptcha">
              <ReCAPTCHA
                sitekey="6LfTnD4UAAAAAKvNYLH2BLriDRk0t29YFqQVGBdp"
                onChange={this.storeCaptcha}
              />
            </div>
            <div className="row">
              <div className="col">
                <input type="submit" value={this.state.sendStatus} />
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
