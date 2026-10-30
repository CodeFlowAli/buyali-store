
import { Link } from "react-router-dom";
import logo from "../assets/BuyAli-Logo.png";
import "./Footer.css";

function Footer() {
  const socialLinks = [
    {
      name: "Facebook",
      icon: "f",
      url: "https://www.facebook.com/codeflowali",
    },
    {
      name: "Instagram",
      icon: "◎",
      url: "https://www.instagram.com/codeflowali",
    },
    {
      name: "LinkedIn",
      icon: "in",
      url: "https://www.linkedin.com/in/codeflowali",
    },
    {
      name: "YouTube",
      icon: "▶",
      url: "https://www.youtube.com/@codeflowali",
    },
  ];

  return (
    <footer className="footer">
      <div className="container">

        <div className="footer-main">

          {/* BRAND */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img src={logo} alt="BuyAli Logo" />
            </Link>

            <p>
              Discover products you love. BuyAli makes online shopping
              simple, convenient, and accessible.
            </p>

            <div className="footer-socials">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Shop Products</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div className="footer-column">
            <h3>Customer Support</h3>
            <ul>
              <li><Link to="/contact">Help & Support</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/contact">Contact Information</Link></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div className="footer-column footer-contact">
            <h3>Get In Touch</h3>

            <a href="mailto:codeflowali@gmmail.com">
              <span className="footer-contact-icon">✉</span>
              codeflowali@gmmail.com
            </a>

            <a
              href="https://wa.me/923293751417"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="footer-contact-icon">◉</span>
              WhatsApp Support
            </a>

            <p>
              We're here to help with your shopping experience.
            </p>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} BuyAli. All Rights Reserved.
          </p>

          <div className="footer-bottom-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <p className="footer-credit">
            Developed by{" "}
            <a
              href="https://codeflowali.kesug.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              CodeFlowAli
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
