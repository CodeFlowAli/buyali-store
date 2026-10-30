import { useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Send,
  Clock,
} from "lucide-react";
import "../styles/Contact.css";

function Contact() {
  useEffect(() => {
    const siteUrl = "https://buyali.co.uk";
    const pageUrl = `${siteUrl}/contact`;
    const pageTitle = "Contact BuyAli | Customer Support & Enquiries";
    const description =
      "Get in touch with BuyAli for product enquiries, order assistance, and customer support. Contact us by email, phone, or WhatsApp.";

    document.title = pageTitle;

    const setMeta = (attribute, key, content) => {
      let element = document.querySelector(
        `meta[${attribute}="${key}"]`
      );

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    setMeta("name", "description", description);
    setMeta(
      "name",
      "keywords",
      "Contact BuyAli, BuyAli customer support, BuyAli contact, online shopping support, product enquiries, WhatsApp orders"
    );
    setMeta("name", "robots", "index, follow");
    setMeta("name", "author", "BuyAli");

    setMeta("property", "og:type", "website");
    setMeta("property", "og:title", pageTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", pageUrl);
    setMeta("property", "og:site_name", "BuyAli");
    setMeta("property", "og:locale", "en_GB");

    setMeta("name", "twitter:card", "summary");
    setMeta("name", "twitter:title", pageTitle);
    setMeta("name", "twitter:description", description);

    let canonical = document.querySelector(
      'link[rel="canonical"]'
    );

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    canonical.href = pageUrl;

    const schema = {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: pageTitle,
      description,
      url: pageUrl,
      mainEntity: {
        "@type": "Organization",
        name: "BuyAli",
        url: `${siteUrl}/`,
        email: "codeflowali@gmail.com",
        telephone: "+923293751417",
      },
      inLanguage: "en-GB",
    };

    let structuredData = document.querySelector(
      'script[data-seo="buyali-contact"]'
    );

    if (!structuredData) {
      structuredData = document.createElement("script");
      structuredData.type = "application/ld+json";
      structuredData.setAttribute("data-seo", "buyali-contact");
      document.head.appendChild(structuredData);
    }

    structuredData.textContent = JSON.stringify(schema);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for contacting BuyAli!");
  };

  return (
    <main className="contact-page">
      {/* HERO */}
      <section className="contact-hero">
        <div className="container">
          <span className="contact-tag">GET IN TOUCH</span>
          <h1>
            Contact <span>BuyAli</span>
          </h1>
          <p>
            Have a question or need help? We'd love to hear from you.
            Get in touch with our team.
          </p>
        </div>
      </section>

      {/* CONTACT CONTENT */}
      <section className="container contact-section">
        <div className="contact-info">
          <span className="contact-tag">CONTACT INFORMATION</span>
          <h2>Let's Talk About Your Needs</h2>

          <p className="contact-description">
            Whether you have a question about a product, an order,
            or anything else, feel free to contact us.
          </p>

          <div className="contact-info-list">
            <a
              href="mailto:codeflowali@gmail.com"
              className="contact-info-item"
            >
              <div className="contact-icon">
                <Mail size={22} />
              </div>
              <div>
                <h3>Email Us</h3>
                <p>codeflowali@gmail.com</p>
              </div>
            </a>

            <a
              href="tel:+923293751417"
              className="contact-info-item"
            >
              <div className="contact-icon">
                <Phone size={22} />
              </div>
              <div>
                <h3>Call Us</h3>
                <p>+92 329 3751417</p>
              </div>
            </a>

            <div className="contact-info-item">
              <div className="contact-icon">
                <MapPin size={22} />
              </div>
              <div>
                <h3>Our Location</h3>
                <p>Pakistan</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-icon">
                <Clock size={22} />
              </div>
              <div>
                <h3>Availability</h3>
                <p>Contact us anytime</p>
              </div>
            </div>
          </div>

          <a
            href="https://wa.me/923293751417"
            target="_blank"
            rel="noreferrer"
            className="contact-whatsapp"
          >
            <MessageCircle size={20} />
            Chat on WhatsApp
          </a>
        </div>

        {/* CONTACT FORM */}
        <div className="contact-form-wrapper">
          <h2>Send Us a Message</h2>
          <p>Fill out the form below and we'll be happy to help.</p>

          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >
            <div className="contact-form-group">
              <label htmlFor="contact-name">Your Name</label>
              <input
                id="contact-name"
                type="text"
                name="name"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="contact-form-group">
              <label htmlFor="contact-email">Email Address</label>
              <input
                id="contact-email"
                type="email"
                name="email"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="contact-form-group">
              <label htmlFor="contact-subject">Subject</label>
              <input
                id="contact-subject"
                type="text"
                name="subject"
                placeholder="What is this about?"
                required
              />
            </div>

            <div className="contact-form-group">
              <label htmlFor="contact-message">Your Message</label>
              <textarea
                id="contact-message"
                name="message"
                rows="5"
                placeholder="Write your message here..."
                required
              />
            </div>

            <button
              type="submit"
              className="contact-submit-btn"
            >
              Send Message <Send size={18} />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Contact;