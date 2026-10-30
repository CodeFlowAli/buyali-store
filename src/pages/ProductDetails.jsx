
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Loader from "../components/Loader";

import {
  ShoppingBag,
  MessageCircle,
  PackageCheck,
  Minus,
  Plus,
  ChevronRight,
  Tag,
  Play,
  LoaderCircle,
} from "lucide-react";

import "../styles/ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setProduct(null);
      setSelectedImage("");
      setQuantity(1);
      setShowVideo(false);

      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories(name),
          payment_methods(name, details),
          return_policies(title, description)
        `)
        .eq("id", id)
        .eq("is_published", true)
        .maybeSingle();

      if (error) {
        console.error("Product loading error:", error);
      }

      if (data) {
        setProduct(data);
        setSelectedImage(data.images?.[0] || "");
      }

      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  // Individual Product SEO
  useEffect(() => {
    if (!product) return;

    const siteUrl = "https://buyali.co.uk";
    const productUrl = `${siteUrl}/products/${product.id}`;

    const productTitle =
      product.seo_title?.trim() ||
      `${product.title} | BuyAli`;

    const productDescription =
      product.seo_description?.trim() ||
      product.short_description?.trim() ||
      product.description?.trim()?.slice(0, 155) ||
      `Explore ${product.title} at BuyAli. Check product details, price and availability, and order conveniently through WhatsApp.`;

    const focusKeyword =
      product.focus_keyword?.trim() || product.title;

    const productImage = product.images?.[0] || "";

    document.title = productTitle;

    const setMeta = (attribute, name, content) => {
      let element = document.head.querySelector(
        `meta[${attribute}="${name}"]`
      );

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }

      element.setAttribute("content", String(content || ""));
    };

    const setCanonical = () => {
      let element = document.head.querySelector(
        'link[rel="canonical"]'
      );

      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", "canonical");
        document.head.appendChild(element);
      }

      element.setAttribute("href", productUrl);
    };

    // Basic SEO
    setMeta("name", "description", productDescription);
    setMeta("name", "keywords", `${focusKeyword}, ${product.title}, BuyAli`);
    setMeta("name", "robots", "index, follow");
    setMeta("name", "author", "BuyAli");

    // Open Graph SEO
    setMeta("property", "og:type", "product");
    setMeta("property", "og:title", productTitle);
    setMeta("property", "og:description", productDescription);
    setMeta("property", "og:url", productUrl);
    setMeta("property", "og:site_name", "BuyAli");
    setMeta("property", "og:locale", "en_GB");

    if (productImage) {
      setMeta("property", "og:image", productImage);
      setMeta("property", "og:image:alt", product.title);
    }

    // Product price metadata
    setMeta("property", "product:price:amount", product.price);
    setMeta("property", "product:price:currency", "PKR");

    // Twitter SEO
    setMeta(
      "name",
      "twitter:card",
      productImage ? "summary_large_image" : "summary"
    );
    setMeta("name", "twitter:title", productTitle);
    setMeta("name", "twitter:description", productDescription);

    if (productImage) {
      setMeta("name", "twitter:image", productImage);
    }

    setCanonical();

    // Product Structured Data
    const schema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      name: product.title,
      description: productDescription,
      sku: String(product.id),
      category: product.categories?.name || undefined,
      url: productUrl,
      image: product.images?.length
        ? product.images
        : undefined,
      brand: {
        "@type": "Brand",
        name: "BuyAli",
      },
      offers: {
        "@type": "Offer",
        url: productUrl,
        priceCurrency: "PKR",
        price: Number(product.price),
        availability:
          Number(product.stock) > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/NewCondition",
      },
    };

    let schemaScript = document.head.querySelector(
      'script[data-seo="product-schema"]'
    );

    if (!schemaScript) {
      schemaScript = document.createElement("script");
      schemaScript.type = "application/ld+json";
      schemaScript.setAttribute("data-seo", "product-schema");
      document.head.appendChild(schemaScript);
    }

    schemaScript.textContent = JSON.stringify(schema);

    return () => {
      schemaScript.remove();
    };
  }, [product]);

  if (loading) {
    return (
      <div className="product-not-found container">
        <LoaderCircle className="loader-icon" size={35} />
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found container">
        <h2>Product Not Found</h2>
        <p>This product is unavailable or has not been published.</p>
        <Link to="/products">Back to Products</Link>
      </div>
    );
  }

  const galleryImages = product.images || [];
  const totalPrice = Number(product.price) * quantity;
  const stock = Number(product.stock) || 0;

  const handleWhatsAppOrder = () => {
    const phoneNumber = (
      product.whatsapp_number || "03293751417"
    )
      .replace(/\D/g, "")
      .replace(/^0/, "92");

    const message = `
Hello! I want to order this product.

Product: ${product.title}
Category: ${product.categories?.name || "Uncategorized"}
Price: Rs. ${Number(product.price).toLocaleString()}
Quantity: ${quantity}
Total: Rs. ${totalPrice.toLocaleString()}

Payment Method: ${product.payment_methods?.name || "Please confirm"}
Payment Details: ${product.payment_methods?.details || "Please confirm"}

Return Policy: ${product.return_policies?.title || "Please confirm"}
Return Details: ${product.return_policies?.description || "Please confirm"}

Product Images:
${galleryImages.length ? galleryImages.join("\n") : "Not available"}

Product Video: ${product.video_url || "Not available"}

Please confirm my order.
    `.trim();

    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="product-details-page container">
      <div className="product-breadcrumb">
        <Link to="/">Home</Link>
        <ChevronRight size={14} />
        <Link to="/products">Products</Link>
        <ChevronRight size={14} />
        <span>{product.title}</span>
      </div>

      <div className="product-details-layout">
        {/* Product Gallery */}
        <div className="details-gallery">
          <div className="main-product-image">
            {showVideo && product.video_url ? (
              <video
                src={product.video_url}
                controls
                autoPlay
                className="product-video-player"
              />
            ) : selectedImage ? (
              <img
                src={selectedImage}
                alt={product.title}
              />
            ) : (
              <div className="product-image-placeholder">
                No product image available
              </div>
            )}
          </div>

          <div className="product-thumbnails">
            {galleryImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                className={
                  !showVideo && selectedImage === image
                    ? "active"
                    : ""
                }
                onClick={() => {
                  setSelectedImage(image);
                  setShowVideo(false);
                }}
              >
                <img
                  src={image}
                  alt={`${product.title} ${index + 1}`}
                />
              </button>
            ))}

            {product.video_url && (
              <button
                className={
                  showVideo
                    ? "active video-thumbnail"
                    : "video-thumbnail"
                }
                onClick={() => setShowVideo(true)}
                aria-label="Play product video"
              >
                <Play size={25} />
                <span>Video</span>
              </button>
            )}
          </div>

          {product.video_url && (
            <p className="gallery-video-note">
              <Play size={15} />
              Product video available
            </p>
          )}
        </div>

        {/* Product Information */}
        <div className="details-info">
          <span className="details-category">
            <Tag size={15} />
            {product.categories?.name || "Uncategorized"}
          </span>

          <h1>{product.title}</h1>

          <div className="details-prices">
            <strong>
              Rs. {Number(product.price).toLocaleString()}
            </strong>

            {Number(product.old_price) > Number(product.price) && (
              <>
                <del>
                  Rs. {Number(product.old_price).toLocaleString()}
                </del>

                <span className="discount-badge">
                  {Math.round(
                    ((Number(product.old_price) -
                      Number(product.price)) /
                      Number(product.old_price)) *
                      100
                  )}
                  % OFF
                </span>
              </>
            )}
          </div>

          {product.short_description && (
            <p className="details-short-description">
              {product.short_description}
            </p>
          )}

          <p className="details-description">
            {product.description}
          </p>

          <p className="details-stock">
            <PackageCheck size={18} />
            {stock > 0
              ? `${stock} items available`
              : "Out of Stock"}
          </p>

          <div className="quantity-section">
            <span>Quantity:</span>

            <div className="quantity-controls">
              <button
                onClick={() =>
                  setQuantity((prev) => Math.max(1, prev - 1))
                }
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus size={17} />
              </button>

              <span>{quantity}</span>

              <button
                onClick={() =>
                  setQuantity((prev) =>
                    Math.min(stock, prev + 1)
                  )
                }
                disabled={quantity >= stock}
                aria-label="Increase quantity"
              >
                <Plus size={17} />
              </button>
            </div>
          </div>

          <div className="details-total">
            Total:
            <strong>
              Rs. {totalPrice.toLocaleString()}
            </strong>
          </div>

          <button
            className="whatsapp-order-btn"
            onClick={handleWhatsAppOrder}
            disabled={stock <= 0}
          >
            <MessageCircle size={20} />
            {stock <= 0 ? "Out of Stock" : "Order on WhatsApp"}
            <ShoppingBag size={19} />
          </button>

          <p className="whatsapp-note">
            You will be redirected to WhatsApp to confirm your order.
          </p>

          {/* Payment Method */}
          {product.payment_methods && (
            <div className="product-extra-info">
              <h3>Payment Method</h3>
              <p>{product.payment_methods.name}</p>
              {product.payment_methods.details && (
                <p>{product.payment_methods.details}</p>
              )}
            </div>
          )}

          {/* Return Policy */}
          {product.return_policies && (
            <div className="product-extra-info">
              <h3>Return Policy</h3>
              <p>{product.return_policies.title}</p>
              <p>{product.return_policies.description}</p>
            </div>
          )}

          {/* Product Description */}
          <div className="product-extra-info">
            <h3>Product Description</h3>
            <p>
              {product.description || "No description available."}
            </p>
          </div>

          {/* Specifications */}
          {product.specifications && (
            <div className="product-extra-info">
              <h3>Specifications</h3>
              <p>{product.specifications}</p>
            </div>
          )}

          {/* Features */}
          {product.features && (
            <div className="product-extra-info">
              <h3>Product Features</h3>
              <p>{product.features}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;
