import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../styles/Home.css";

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Homepage SEO
  useEffect(() => {
    const siteUrl = "https://buyali.co.uk";
    const pageTitle =
      "BuyAli | Shop Quality Products Online in the UK";
    const description =
      "Discover quality products at BuyAli. Explore fashion, electronics, mobile accessories, home essentials and more. Browse our collection and order easily through WhatsApp.";
    const keywords =
      "BuyAli, online shopping UK, shop online UK, quality products, fashion, electronics, mobile accessories, home and kitchen, beauty products";

    document.title = pageTitle;
    document.documentElement.lang = "en-GB";

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
    setMeta("name", "keywords", keywords);
    setMeta("name", "robots", "index, follow");
    setMeta("name", "author", "BuyAli");
    setMeta("name", "viewport", "width=device-width, initial-scale=1.0");

    setMeta("property", "og:type", "website");
    setMeta("property", "og:title", pageTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", siteUrl);
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
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }

    canonical.setAttribute("href", `${siteUrl}/`);

    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${siteUrl}/#organization`,
          name: "BuyAli",
          url: `${siteUrl}/`,
        },
        {
          "@type": "WebSite",
          "@id": `${siteUrl}/#website`,
          name: "BuyAli",
          url: `${siteUrl}/`,
          publisher: {
            "@id": `${siteUrl}/#organization`,
          },
          inLanguage: "en-GB",
        },
        {
          "@type": "WebPage",
          "@id": `${siteUrl}/#webpage`,
          url: `${siteUrl}/`,
          name: pageTitle,
          description,
          isPartOf: {
            "@id": `${siteUrl}/#website`,
          },
          inLanguage: "en-GB",
        },
      ],
    };

    let structuredData = document.querySelector(
      'script[data-seo="buyali-home"]'
    );

    if (!structuredData) {
      structuredData = document.createElement("script");
      structuredData.type = "application/ld+json";
      structuredData.setAttribute("data-seo", "buyali-home");
      document.head.appendChild(structuredData);
    }

    structuredData.textContent = JSON.stringify(schema);
  }, []);

  useEffect(() => {
    const fetchHomeData = async () => {
      const [productsResult, categoriesResult] = await Promise.all([
        supabase
          .from("products")
          .select("*, categories(name)")
          .eq("is_published", true)
          .order("created_at", { ascending: false })
          .limit(4),

        supabase
          .from("categories")
          .select("id, name")
          .order("name", { ascending: true }),
      ]);

      if (productsResult.error) {
        console.error("Home products error:", productsResult.error);
      } else {
        setFeaturedProducts(productsResult.data || []);
      }

      if (categoriesResult.error) {
        console.error("Home categories error:", categoriesResult.error);
      } else {
        setCategories(categoriesResult.data || []);
      }

      setLoadingProducts(false);
    };

    fetchHomeData();
  }, []);

  const categoryIcons = {
    Fashion: "👕",
    Electronics: "🎧",
    "Mobile Accessories": "📱",
    "Home & Kitchen": "🏠",
    "Beauty & Personal Care": "✨",
    Sports: "⚽",
    "Computers & Laptops": "💻",
  };

  const categoryDescriptions = {
    Fashion: "Explore latest fashion",
    Electronics: "Modern technology",
    "Mobile Accessories": "Accessories for your devices",
    "Home & Kitchen": "Everything for your home",
    "Beauty & Personal Care": "Care and beauty essentials",
    Sports: "Explore sports products",
    "Computers & Laptops": "Technology and computers",
  };

  return (
    <main className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-content">
          <div className="hero-text">
            <span className="section-tag">WELCOME TO BUYALI</span>

            <h1>
              Discover Products
              <br />
              <span>You Will Love.</span>
            </h1>

            <p>
              Explore quality products, amazing collections and
              great prices — all in one place.
            </p>

            <div className="hero-buttons">
              <Link to="/products" className="primary-btn">
                Explore Products
              </Link>

              <Link to="/about" className="secondary-btn">
                Learn More
              </Link>
            </div>
          </div>

          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000"
              alt="BuyAli online shopping collection"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section container">
        <div className="benefit-item">
          <span>🚚</span>
          <h3>Easy Shopping</h3>
          <p>Simple product browsing</p>
        </div>

        <div className="benefit-item">
          <span>💬</span>
          <h3>WhatsApp Orders</h3>
          <p>Order directly through WhatsApp</p>
        </div>

        <div className="benefit-item">
          <span>⭐</span>
          <h3>Quality Products</h3>
          <p>Explore our collection</p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section container">
        <div className="section-heading">
          <div>
            <span className="section-tag">SHOP BY CATEGORY</span>
            <h2>Explore Categories</h2>
          </div>

          <Link to="/products">View All Products →</Link>
        </div>

        <div className="categories-grid">
          {categories.map((item) => (
            <Link
              to={`/products?category=${encodeURIComponent(item.name)}`}
              className="category-card"
              key={item.id}
            >
              <span className="category-icon">
                {categoryIcons[item.name] || "🛍️"}
              </span>

              <h3>{item.name}</h3>

              <p>
                {categoryDescriptions[item.name] ||
                  "Explore our collection"}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section container">
        <div className="section-heading">
          <div>
            <span className="section-tag">OUR COLLECTION</span>
            <h2>Featured Products</h2>
          </div>

          <Link to="/products">View All →</Link>
        </div>

        {loadingProducts ? (
          <div className="empty-products">
            <p>Loading products...</p>
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <Link to={`/products/${product.id}`}>
                  <div className="product-image">
                    <img
                      src={product.images?.[0] || ""}
                      alt={`${product.title} - BuyAli`}
                      loading="lazy"
                    />
                  </div>
                </Link>

                <div className="product-info">
                  <span className="product-category">
                    {product.categories?.name || "Uncategorized"}
                  </span>

                  <h3>
                    <Link to={`/products/${product.id}`}>
                      {product.title}
                    </Link>
                  </h3>

                  <div className="product-prices">
                    <strong>
                      Rs. {Number(product.price).toLocaleString()}
                    </strong>

                    {product.old_price && (
                      <del>
                        Rs. {Number(product.old_price).toLocaleString()}
                      </del>
                    )}
                  </div>

                  <Link
                    to={`/products/${product.id}`}
                    className="product-button"
                  >
                    View Details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-products">
            <h3>No products available</h3>
            <p>New products will appear here soon.</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="home-cta">
        <div className="container">
          <h2>Ready to Find Something Amazing?</h2>
          <p>
            Explore our collection and discover your next favorite product.
          </p>

          <Link to="/products" className="primary-btn">
            Start Shopping
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;