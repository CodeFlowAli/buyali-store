import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Target,
  Heart,
  ShieldCheck,
  MessageCircle,
  ArrowRight,
  Headphones,
} from "lucide-react";
import "../styles/About.css";

function About() {
  useEffect(() => {
    const siteUrl = "https://buyali.co.uk";
    const pageUrl = `${siteUrl}/about`;
    const pageTitle = "About BuyAli | Our Story, Mission & Vision";
    const description =
      "Learn about BuyAli, our mission, and how we make online shopping simple and convenient. Discover our approach to products, customer support, and WhatsApp orders.";

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
      "About BuyAli, BuyAli online shopping, BuyAli mission, BuyAli vision, online shopping platform, WhatsApp orders"
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
      "@type": "AboutPage",
      name: pageTitle,
      description,
      url: pageUrl,
      isPartOf: {
        "@type": "WebSite",
        name: "BuyAli",
        url: `${siteUrl}/`,
      },
      about: {
        "@type": "Organization",
        name: "BuyAli",
        url: `${siteUrl}/`,
      },
      inLanguage: "en-GB",
    };

    let structuredData = document.querySelector(
      'script[data-seo="buyali-about"]'
    );

    if (!structuredData) {
      structuredData = document.createElement("script");
      structuredData.type = "application/ld+json";
      structuredData.setAttribute("data-seo", "buyali-about");
      document.head.appendChild(structuredData);
    }

    structuredData.textContent = JSON.stringify(schema);
  }, []);

  return (
    <main className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container about-hero-content">
          <span className="about-tag">ABOUT BUYALI</span>

          <h1>
            Making Online Shopping
            <span> Simple & Better</span>
          </h1>

          <p>
            Welcome to BuyAli! Our goal is to make discovering and ordering
            products simple, convenient, and enjoyable for everyone.
          </p>

          <Link to="/products" className="about-primary-btn">
            Explore Products <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Introduction */}
      <section className="container about-intro">
        <div className="about-intro-icon">
          <ShoppingBag size={42} />
        </div>

        <div className="about-intro-content">
          <span className="about-tag">WHO WE ARE</span>
          <h2>Welcome to BuyAli</h2>

          <p>
            BuyAli is an online shopping platform designed to help customers
            discover products and connect with sellers easily. We believe
            shopping should be straightforward, convenient, and accessible.
          </p>

          <p>
            From exploring products to placing an order through WhatsApp,
            we aim to provide a simple shopping experience.
          </p>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="about-purpose">
        <div className="container about-purpose-grid">
          <article className="purpose-card">
            <div className="purpose-icon">
              <Target size={27} />
            </div>

            <h3>Our Mission</h3>

            <p>
              To make online shopping easier by providing a simple way to
              explore products and contact sellers.
            </p>
          </article>

          <article className="purpose-card">
            <div className="purpose-icon">
              <Heart size={27} />
            </div>

            <h3>Our Vision</h3>

            <p>
              To build a convenient shopping platform where customers can
              discover products with confidence and ease.
            </p>
          </article>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container about-why">
        <div className="about-section-heading">
          <span className="about-tag">WHY BUYALI?</span>
          <h2>Why Choose BuyAli?</h2>
          <p>We focus on making your shopping journey simple.</p>
        </div>

        <div className="about-features-grid">
          <article className="about-feature">
            <div className="feature-icon">
              <ShoppingBag size={25} />
            </div>

            <h3>Easy Shopping</h3>
            <p>
              Explore available products and find what you need easily.
            </p>
          </article>

          <article className="about-feature">
            <div className="feature-icon">
              <MessageCircle size={25} />
            </div>

            <h3>WhatsApp Orders</h3>
            <p>
              Contact the seller directly and place your order through WhatsApp.
            </p>
          </article>

          <article className="about-feature">
            <div className="feature-icon">
              <ShieldCheck size={25} />
            </div>

            <h3>Clear Information</h3>
            <p>
              Check product details, prices, payment methods, and return policies.
            </p>
          </article>

          <article className="about-feature">
            <div className="feature-icon">
              <Headphones size={25} />
            </div>

            <h3>Direct Communication</h3>
            <p>
              Connect with the seller to discuss your order and questions.
            </p>
          </article>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="container">
          <span className="about-tag">START EXPLORING</span>

          <h2>Find Something You'll Love</h2>

          <p>
            Explore our collection and discover your next favorite product.
          </p>

          <Link to="/products" className="about-primary-btn">
            Shop Now <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default About;