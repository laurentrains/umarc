import React from 'react';
import autobind from 'react-autobind';
import ReCAPTCHA from 'react-google-recaptcha';
import SimpleSchema from 'simpl-schema';

export default class ContactForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      validEmail: false,
      message: '',
      sendStatus: 'Submit',
      captchaResponse: '',
    };

    autobind(this);
  }

  storeCaptcha(captchaValue) {
    const newState = {
      captchaResponse: captchaValue,
    };

    if (this.state.sendStatus === 'Error: No Recaptcha') {
      newState.sendStatus = 'Submit';
    }

    this.setState(newState);
  }

  storeName(e) {
    const name = e.target.value;
    this.setState({ name });
  }

  storeEmail(e) {
    const newState = {
      email: e.target.value,
      validEmail: true,
    };

    const emailSchema = new SimpleSchema({
      email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
      },
    });

    try {
      emailSchema.validate({ email: newState.email });
      if (this.state.sendStatus === 'Error: Invalid Email') {
        newState.sendStatus = 'Submit';
      }
    } catch (ex) {
      newState.validEmail = false;
    }

    this.setState(newState);
  }

  storeMessage(e) {
    const message = e.target.value.substring(0, 500);
    this.setState({ message });
  }

  submitEmail(e) {
    e.preventDefault();

    if (!this.state.validEmail) {
      this.setState({ sendStatus: 'Error: Invalid Email' });
      return;
    }

    if (!this.state.captchaResponse) {
      this.setState({ sendStatus: 'Error: No Recaptcha' });
      return;
    }

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
        this.setState({ sendStatus: 'Error sending message' });
      });
  }

  render() {
    return (
      <div id="contact">
        <form onSubmit={this.submitEmail}>
          <div className="container">
            <h1>Contact Us</h1>
            <div className="row">
              <div className="col-12 col-md-6">
                <label>Name</label>
                <input onChange={this.storeName} type="text" placeholder="Name here" />
              </div>
              <div className="col-12 col-md-6">
                <label>Email</label>
                <input onChange={this.storeEmail} type="text" placeholder="Email here" />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label>Message</label>
                <textarea onChange={this.storeMessage} placeholder="Type here" />
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
