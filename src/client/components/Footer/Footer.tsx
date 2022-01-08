import React from 'react';
import '../../sass/Footer.scss';

const Footer = () => (
  <footer className="footer">
    <p className="footer__text">
      Created by{' '}
      <a
        className="footer__link"
        href="https://github.com/sukcinitas"
        target="_blank"
        rel="noreferrer noopener"
      >
        sukcinitas
      </a>
    </p>
  </footer>
);

export default Footer;
