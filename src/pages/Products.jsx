import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Loader from "../components/Loader";
import "../styles/Products.css";

function Products() {
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // SEO
  useEffect(() => {
    const title = "Shop Products Online | BuyAli";
    const description =
      "Explore the BuyAli product collection. Discover quality products, compare prices, check availability, and order conveniently through WhatsApp.";

    document.title = title;

    const setMeta = (name, content, attribute = "name") => {
      let element = document.querySelector(
        `meta[${attribute}="${name}"]`
      );

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    const setCanonical = (url) => {
      let canonical = document.querySelector('link[rel="canonical"]');

      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }

      canonical.setAttribute("href", url);
    };

    setMeta("description", description);
    setMeta(
      "keywords",
      "BuyAli, shop online, online shopping, quality products, product collection, affordable products, WhatsApp orders"
    );
    setMeta("robots", "index, follow");
    setMeta("author", "BuyAli");
    setMeta("og:type", "website", "property");
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", "https://buyali.co.uk/products", "property");
    setMeta("og:site_name", "BuyAli", "property");
    setMeta("og:locale", "en_GB", "property");
    setMeta("twitter:card", "summary");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);

    setCanonical("https://buyali.co.uk/products");

    // Collection Page structured data
    const schema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "BuyAli Products",
      description,
      url: "https://buyali.co.uk/products",
      isPartOf: {
        "@type": "WebSite",
        name: "BuyAli",
        url: "https://buyali.co.uk",
      },
    };

    let script = document.querySelector(
      'script[data-seo="products-schema"]'
    );

    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo", "products-schema");
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(schema);

    return () => {
      script.remove();
    };
  }, []);

  // Fetch published products
  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name)")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (!isMounted) return;

      if (error) {
        console.error("Products loading error:", error);
        setProducts([]);
        setErrorMessage(
          "Products could not be loaded. Please try again later."
        );
      } else {
        setProducts(data || []);
      }

      setLoading(false);
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    const categoryNames = products
      .map((product) => product.categories?.name)
      .filter(Boolean);

    return ["All", ...new Set(categoryNames)];
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return products.filter((product) => {
      const title = product.title?.toLowerCase() || "";
      const description = product.description?.toLowerCase() || "";
      const shortDescription =
        product.short_description?.toLowerCase() || "";
      const categoryName = product.categories?.name || "";

      const matchesSearch =
        !searchText ||
        title.includes(searchText) ||
        description.includes(searchText) ||
        shortDescription.includes(searchText) ||
        categoryName.toLowerCase().includes(searchText);

      const matchesCategory =
        category === "All" || categoryName === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-PK");
  };

  const getDiscount = (oldPrice, currentPrice) => {
    const oldValue = Number(oldPrice);
    const currentValue = Number(currentPrice);

    if (
      !Number.isFinite(oldValue) ||
      !Number.isFinite(currentValue) ||
      oldValue <= currentValue ||
      oldValue <= 0
    ) {
      return 0;
    }

    return Math.round(
      ((oldValue - currentValue) / oldValue) * 100
    );
  };

  return (
    <main className="products-page">
      {/* Products Hero */}
      <section className="products-hero">
        <div className="container">
          <span className="section-tag">OUR COLLECTION</span>
          <h1>Explore Our Products</h1>
          <p>
            Discover quality products, explore our collection, and
            find something that suits your needs.
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="container products-section">
        <div className="products-toolbar">
          <input
            type="search"
            placeholder="Search products..."
            aria-label="Search products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={category}
            aria-label="Filter products by category"
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Product Results */}
        {loading ? (
          <Loader />
        ) : errorMessage ? (
          <div className="empty-products">
            <h3>Something went wrong</h3>
            <p>{errorMessage}</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            <div className="products-grid">
              {filteredProducts.map((product) => {
                const discount = getDiscount(
                  product.old_price,
                  product.price
                );

                return (
                  <article
                    className="product-card"
                    key={product.id}
                  >
                    <Link to={`/products/${product.id}`}>
                      <div className="product-image">
                        <img
                          src={product.images?.[0] || ""}
                          alt={product.title || "BuyAli product"}
                          loading="lazy"
                        />

                        {discount > 0 && (
                          <span className="discount-badge">
                            {discount}% OFF
                          </span>
                        )}
                      </div>
                    </Link>

                    <div className="product-info">
                      <span className="product-category">
                        {product.categories?.name ||
                          "Uncategorized"}
                      </span>

                      <span
                        className={
                          Number(product.stock) > 0
                            ? "stock-available"
                            : "stock-out"
                        }
                      >
                        {Number(product.stock) > 0
                          ? "In Stock"
                          : "Out of Stock"}
                      </span>

                      <h3>
                        <Link to={`/products/${product.id}`}>
                          {product.title}
                        </Link>
                      </h3>

                      <div className="product-prices">
                        <strong>
                          Rs. {formatPrice(product.price)}
                        </strong>

                        {discount > 0 && (
                          <del>
                            Rs. {formatPrice(product.old_price)}
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
                );
              })}
            </div>

            <p className="products-results-count">
              Showing {filteredProducts.length} of {products.length}{" "}
              products
            </p>
          </>
        ) : (
          <div className="empty-products">
            <h3>No products found</h3>
            <p>
              Try another search or select a different category.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Products;