import React from 'react';
import ContactForm from './ContactForm';

const App = () => (
  <div>
    <div id="navigation">
      <img src="/umark_logo.svg" />
      <ul>
        <a href="#distributors">
          <li>Find Distributors</li>
        </a>
      </ul>
    </div>

    <div id="hero">
      <img src="/umark_logo.svg" />
    </div>

    <div id="about">
      <div className="container">
        <h1>About U'Marc</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ut nibh risus. Aenean
          mattis interdum lorem vitae eleifend. Duis id pharetra libero, ut sodales nisl. Praesent
          interdum, ligula nec imperdiet bibendum, nulla massa euismod odio, in semper ligula mauris
          ac velit. Donec iaculis scelerisque euismod. Maecenas ex ipsum, venenatis ac mauris quis,
          sodales semper lacus. Fusce vitae tincidunt ipsum.
        </p>
      </div>
    </div>

    <div id="products">
      <div className="container product">
        <div className="row">
          <div className="col-12 col-md-6">
            <img src="/umarc_white.png" />
          </div>
          <div className="col-12 col-md-6">
            <h2>White U'Marc</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ut nibh risus.
              Aenean mattis interdum lorem vitae eleifend. Duis id pharetra libero, ut sodales nisl.
              Praesent interdum, ligua nec imperdiet bibendum, nulla{' '}
            </p>
            <a href="#distributors">
              <button>Find Distributors</button>
            </a>
          </div>
        </div>
      </div>
      <div className="container product">
        <div className="row">
          <div className="col-12 col-md-6">
            <img src="/umarc_orange.png" />
          </div>
          <div className="col-12 col-md-6">
            <h2>Orange U'Marc</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ut nibh risus.
              Aenean mattis interdum lorem vitae eleifend. Duis id pharetra libero, ut sodales nisl.
              Praesent interdum, ligua nec imperdiet bibendum, nulla{' '}
            </p>
            <a href="#distributors">
              <button>Find Distributors</button>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div id="faq">
      <div className="container">
        <h1>FAQ</h1>
      </div>
      <div className="container question-area">
        <p className="question">Lorem ipsum dolor sit amet, consectetur?</p>
        <p>
          adipiscing elit. Phasellus ut nibh risus. Aenean mattis interdum lorem vitae eleifend.
          Duis id pharetra libero, ut sodales nisl. Praesent interdum, ligula nec imperdiet
          bibendum, nulla massa euismod odio, in semper ligula mauris ac velit. Donec iaculis
          scelerisque euismod. Maecenas ex ipsum, venenatis ac{' '}
        </p>
      </div>

      <div className="container question-area">
        <p className="question">Lorem ipsum dolor sit amet, consectetur?</p>
        <p>
          adipiscing elit. Phasellus ut nibh risus. Aenean mattis interdum lorem vitae eleifend.
          Duis id pharetra libero, ut sodales nisl. Praesent interdum, ligula nec imperdiet
          bibendum, nulla massa euismod odio, in semper ligula mauris ac velit. Donec iaculis
          scelerisque euismod. Maecenas ex ipsum, venenatis ac{' '}
        </p>
      </div>
    </div>

    <div id="distributors">
      <div className="container">
        <h1>Distributors</h1>
        <div className="row">
          <div className="col-6 col-md-4">
            <img src="/umark_logo.svg" />
          </div>
          <div className="col-6 col-md-4">
            <img src="/umark_logo.svg" />
          </div>
          <div className="col-6 col-md-4">
            <img src="/umark_logo.svg" />
          </div>
        </div>
      </div>
    </div>

    <ContactForm />

    <div id="footer">
      <p>© 2017 U'Marc</p>
    </div>
  </div>
);

export default App;
