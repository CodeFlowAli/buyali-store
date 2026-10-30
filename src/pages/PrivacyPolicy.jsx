import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  User,
  Database,
  MessageCircle,
  Cookie,
  Lock,
  Mail,
} from "lucide-react";

import "../styles/PrivacyPolicy.css";

function PrivacyPolicy() {
  useEffect(() => {
    const title = "Privacy Policy | BuyAli";
    const description =
      "Read BuyAli's Privacy Policy to understand how we collect, use, store and protect your personal information when browsing our website or placing orders.";

    document.title = title;

    const setMeta = (attribute, name, content) => {
      let element = document.head.querySelector(
        `meta[${attribute}="${name}"]`
      );

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    // Basic SEO
    setMeta("name", "description", description);
    setMeta(
      "name",
      "keywords",
      "BuyAli privacy policy, BuyAli data protection, privacy policy, personal information, data security, WhatsApp orders"
    );
    setMeta("name", "robots", "index, follow");
    setMeta("name", "author", "BuyAli");

    // Open Graph SEO
    setMeta("property", "og:type", "website");
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta(
      "property",
      "og:url",
      "https://buyali.co.uk/privacy-policy"
    );
    setMeta("property", "og:site_name", "BuyAli");
    setMeta("property", "og:locale", "en_GB");

    // Twitter SEO
    setMeta("name", "twitter:card", "summary");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);

    // Canonical URL
    let canonical = document.head.querySelector(
      'link[rel="canonical"]'
    );

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    canonical.href = "https://buyali.co.uk/privacy-policy";

    // Structured Data
    const schema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "BuyAli Privacy Policy",
      description,
      url: "https://buyali.co.uk/privacy-policy",
      isPartOf: {
        "@type": "WebSite",
        name: "BuyAli",
        url: "https://buyali.co.uk",
      },
      publisher: {
        "@type": "Organization",
        name: "BuyAli",
        url: "https://buyali.co.uk",
      },
    };

    let schemaScript = document.querySelector(
      'script[data-seo="privacy-schema"]'
    );

    if (!schemaScript) {
      schemaScript = document.createElement("script");
      schemaScript.type = "application/ld+json";
      schemaScript.setAttribute("data-seo", "privacy-schema");
      document.head.appendChild(schemaScript);
    }

    schemaScript.textContent = JSON.stringify(schema);

    return () => {
      schemaScript.remove();
    };
  }, []);

  return (
    <main className="privacy-page">
      <section className="privacy-hero">
        <div className="privacy-container">
          <div className="privacy-icon">
            <ShieldCheck size={34} />
          </div>

          <span className="privacy-label">YOUR PRIVACY MATTERS</span>
          <h1>Privacy Policy</h1>

          <p>
            Your privacy is important to us. Learn how BuyAli collects,
            uses, and protects your information when you visit our website
            or place an order.
          </p>

          <span className="privacy-updated">
            Last Updated: October 30, 2026
          </span>
        </div>
      </section>

      <section className="privacy-content">
        <div className="privacy-container">
          <div className="privacy-intro">
            <h2>Welcome to BuyAli</h2>
            <p>
              This Privacy Policy explains how BuyAli handles information
              when you use our website, browse products, or contact us.
              By using our website, you agree to the practices described
              in this policy.
            </p>
          </div>

          <div className="privacy-section">
            <div className="privacy-section-icon">
              <User />
            </div>
            <div>
              <h2>1. Information We Collect</h2>
              <p>
                When you interact with BuyAli, we may collect information
                that you voluntarily provide, including:
              </p>
              <ul>
                <li>Your name and contact details.</li>
                <li>Phone number and WhatsApp contact information.</li>
                <li>Delivery address and order details, when provided.</li>
                <li>Messages or inquiries you send to us.</li>
              </ul>
              <p>
                We may also collect basic technical information such as
                browser type, device information, and website usage data.
              </p>
            </div>
          </div>

          <div className="privacy-section">
            <div className="privacy-section-icon">
              <Database />
            </div>
            <div>
              <h2>2. How We Use Your Information</h2>
              <p>We may use the information we collect to:</p>
              <ul>
                <li>Respond to your questions and requests.</li>
                <li>Process and manage your orders.</li>
                <li>Communicate with you about products and orders.</li>
                <li>Improve our website and shopping experience.</li>
                <li>Maintain website security and prevent misuse.</li>
              </ul>
            </div>
          </div>

          <div className="privacy-section">
            <div className="privacy-section-icon">
              <MessageCircle />
            </div>
            <div>
              <h2>3. WhatsApp Orders</h2>
              <p>
                BuyAli allows customers to contact us through WhatsApp
                to place orders and ask questions. When you use this
                feature, the information you share is handled through
                WhatsApp and may be subject to WhatsApp's own Privacy
                Policy and terms.
              </p>
              <p>
                Please avoid sharing unnecessary sensitive or confidential
                information through messages.
              </p>
            </div>
          </div>

          <div className="privacy-section">
            <div className="privacy-section-icon">
              <Cookie />
            </div>
            <div>
              <h2>4. Cookies and Website Data</h2>
              <p>
                Our website or its service providers may use cookies or
                similar technologies to support website functionality,
                understand website usage, and improve performance.
              </p>
              <p>
                You can manage or disable cookies through your browser
                settings. Some website features may not work as expected
                if cookies are disabled.
              </p>
            </div>
          </div>

          <div className="privacy-section">
            <div className="privacy-section-icon">
              <Lock />
            </div>
            <div>
              <h2>5. Data Security</h2>
              <p>
                We take reasonable steps to protect the information
                available to us against unauthorized access, misuse,
                or disclosure. However, no online service or method
                of electronic storage can be guaranteed to be completely
                secure.
              </p>
            </div>
          </div>

          <div className="privacy-section">
            <div className="privacy-section-icon">
              <Database />
            </div>
            <div>
              <h2>6. Sharing of Information</h2>
              <p>
                We do not sell your personal information. We may share
                relevant information when necessary to operate our
                website, communicate with you, fulfill an order, or
                comply with applicable legal requirements.
              </p>
              <p>
                Third-party services, such as hosting, database, and
                communication providers, may process information
                according to their own privacy policies.
              </p>
            </div>
          </div>

          <div className="privacy-section">
            <div className="privacy-section-icon">
              <User />
            </div>
            <div>
              <h2>7. Your Privacy Choices</h2>
              <p>
                You may contact us to ask about personal information
                you have shared with BuyAli or request correction or
                deletion where applicable and legally possible.
              </p>
            </div>
          </div>

          <div className="privacy-section">
            <div className="privacy-section-icon">
              <ShieldCheck />
            </div>
            <div>
              <h2>8. Third-Party Websites</h2>
              <p>
                Our website may contain links to third-party websites
                or services. We are not responsible for their content,
                security, or privacy practices. Please review their
                policies before sharing your information.
              </p>
            </div>
          </div>

          <div className="privacy-section">
            <div className="privacy-section-icon">
              <Database />
            </div>
            <div>
              <h2>9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy when our website,
                services, or practices change. Any updates will be
                published on this page with a revised update date.
              </p>
            </div>
          </div>

          <div className="privacy-contact-box">
            <div className="privacy-contact-icon">
              <Mail />
            </div>
            <h2>Questions About Your Privacy?</h2>
            <p>
              If you have questions about this Privacy Policy or how
              your information is handled, please contact our team.
            </p>
            <Link to="/contact" className="privacy-contact-btn">
              Contact Us
            </Link>
          </div>

          <div className="privacy-back">
            <Link to="/">← Back to Home</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PrivacyPolicy;