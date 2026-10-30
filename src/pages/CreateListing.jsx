import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import {
  Package,
  ImagePlus,
  Video,
  Search,
  Save,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/CreateListing.css";

export default function CreateListing() {
  const [form, setForm] = useState({
    title: "",
    shortDescription: "",
    description: "",
    category: "",
    price: "",
    oldPrice: "",
    stock: "",
    whatsappNumber: "",
    paymentMethod: "",
    returnPolicy: "",
    videoUrl: "",
    specifications: "",
    features: "",
    seoTitle: "",
    seoDescription: "",
    focusKeyword: "",
  });

  const [images, setImages] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [returnPolicies, setReturnPolicies] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(true);
  const [policyLoading, setPolicyLoading] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    setImages((prev) => [...prev, ...selectedFiles]);
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };


  
const handleSubmit = async (e) => {
  e.preventDefault();

  if (isSubmitting) return;

  setIsSubmitting(true);

  try {
    const uploadedImageUrls = await Promise.all(
      images.map(async (image) => {
        const filePath = `products/${crypto.randomUUID()}-${image.name}`;

        const { error: uploadError } = await supabase.storage
          .from("product-media")
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("product-media")
          .getPublicUrl(filePath);

        return data.publicUrl;
      })
    );

    const productData = {
      title: form.title.trim(),
      short_description: form.shortDescription.trim(),
      description: form.description.trim(),
      category_id: form.category || null,
      price: Number(form.price),
      old_price: form.oldPrice ? Number(form.oldPrice) : null,
      stock: Number(form.stock),
      images: uploadedImageUrls,
      video_url: form.videoUrl.trim() || null,
      whatsapp_number: form.whatsappNumber.trim(),
      payment_method_id: form.paymentMethod || null,
      return_policy_id: form.returnPolicy || null,
      specifications: form.specifications.trim(),
      features: form.features.trim(),
      seo_title: form.seoTitle.trim(),
      seo_description: form.seoDescription.trim(),
      focus_keyword: form.focusKeyword.trim(),
      is_published: false,
    };

    const { error: insertError } = await supabase
      .from("products")
      .insert([productData]);

    if (insertError) throw insertError;

    alert("Product saved successfully as Draft!");

    setForm({
      title: "",
      shortDescription: "",
      description: "",
      category: "",
      price: "",
      oldPrice: "",
      stock: "",
      whatsappNumber: "",
      paymentMethod: "",
      returnPolicy: "",
      videoUrl: "",
      specifications: "",
      features: "",
      seoTitle: "",
      seoDescription: "",
      focusKeyword: "",
    });

    setImages([]);

  } catch (error) {
    console.error("Product save error:", error);
    alert(`Product save failed: ${error.message}`);
  } finally {
    setIsSubmitting(false);
  }
};


  
const [categories, setCategories] = useState([]);
const [categoriesLoading, setCategoriesLoading] = useState(true);
const [isSubmitting, setIsSubmitting] = useState(false);

useEffect(() => {
  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name")
      .order("name");

    if (error) {
      console.error("Categories error:", error.message);
    } else {
      setCategories(data || []);
    }

    setCategoriesLoading(false);
  };

  fetchCategories();
}, []);



useEffect(() => {
  const fetchPaymentMethods = async () => {
    const { data, error } = await supabase
      .from("payment_methods")
      .select("id, name")
      .eq("is_active", true)
      .order("name");

    if (error) {
      console.error("Payment methods error:", error.message);
    } else {
      setPaymentMethods(data || []);
    }

    setPaymentLoading(false);
  };

  fetchPaymentMethods();
}, []);

useEffect(() => {
  const fetchReturnPolicies = async () => {
    const { data, error } = await supabase
      .from("return_policies")
      .select("id, title")
      .eq("is_active", true)
      .order("title");

    if (error) {
      console.error("Return policies error:", error.message);
    } else {
      setReturnPolicies(data || []);
    }

    setPolicyLoading(false);
  };

  fetchReturnPolicies();
}, []);



  return (
    <div className="create-listing-page">
      <div className="listing-header">
        <div>
          <Link to="/admin" className="listing-back">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <h1>Create New Listing</h1>
          <p>Add a new product to your BuyAli store.</p>
        </div>

        <span className="listing-status">Draft Listing</span>
      </div>

      <form onSubmit={handleSubmit} className="listing-form">

        {/* Basic Information */}
        <section className="listing-section">
          <div className="listing-section-title">
            <Package size={21} />
            <div>
              <h2>Basic Information</h2>
              <p>Enter your product's main details.</p>
            </div>
          </div>

          <div className="listing-field">
            <label>Product Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter product title"
              required
            />
          </div>

          <div className="listing-field">
            <label>Short Description</label>
            <textarea
              name="shortDescription"
              value={form.shortDescription}
              onChange={handleChange}
              placeholder="Write a short product introduction"
              rows="3"
            />
          </div>

          <div className="listing-field">
            <label>Full Product Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Write complete product details..."
              rows="7"
              required
            />
          </div>

          
<div className="listing-field">
  <label>Category *</label>

  <select
    name="category"
    value={form.category}
    onChange={handleChange}
    required
    disabled={categoriesLoading}
  >
    <option value="">
      {categoriesLoading ? "Loading categories..." : "Select category"}
    </option>

    {categories.map((category) => (
      <option key={category.id} value={category.id}>
        {category.name}
      </option>
    ))}
  </select>

  {!categoriesLoading && categories.length === 0 && (
    <small>No categories found. Add categories from Admin Panel.</small>
  )}
</div>

        </section>

        {/* Pricing and Stock */}
        <section className="listing-section">
          <div className="listing-section-title">
            <Package size={21} />
            <div>
              <h2>Pricing & Inventory</h2>
              <p>Set your product price and available stock.</p>
            </div>
          </div>

          <div className="listing-grid">
            <div className="listing-field">
              <label>Selling Price (PKR) *</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="3500"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="listing-field">
              <label>Old Price (PKR)</label>
              <input
                type="number"
                name="oldPrice"
                value={form.oldPrice}
                onChange={handleChange}
                placeholder="4500"
                min="0"
                step="0.01"
              />
            </div>

            <div className="listing-field">
              <label>Stock Quantity *</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="20"
                min="0"
                required
              />
            </div>
          </div>
        </section>

        {/* Product Media */}
        <section className="listing-section">
          <div className="listing-section-title">
            <ImagePlus size={21} />
            <div>
              <h2>Product Media</h2>
              <p>Upload multiple product images and a video.</p>
            </div>
          </div>

          <div className="listing-field">
            <label>Product Images *</label>

            <label className="listing-upload">
              <ImagePlus size={28} />
              <strong>Click to upload images</strong>
              <span>JPG, PNG, WEBP (Multiple images allowed)</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                onChange={handleImageChange}
              />
            </label>

            <div className="listing-image-preview">
              {images.map((image, index) => (
                <div className="listing-preview-item" key={`${image.name}-${index}`}>
                  <img src={URL.createObjectURL(image)} alt={image.name} />
                  <button type="button" onClick={() => removeImage(index)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="listing-field">
            <label>
              <Video size={17} />
              Product Video URL
            </label>
            <input
              type="url"
              name="videoUrl"
              value={form.videoUrl}
              onChange={handleChange}
              placeholder="https://example.com/product-video.mp4"
            />
          </div>
        </section>

        {/* Specifications */}
        <section className="listing-section">
          <div className="listing-section-title">
            <Package size={21} />
            <div>
              <h2>Specifications & Features</h2>
              <p>Add technical details and product highlights.</p>
            </div>
          </div>

          <div className="listing-field">
            <label>Specifications</label>
            <textarea
              name="specifications"
              value={form.specifications}
              onChange={handleChange}
              placeholder={"Brand: Example\nColor: Black\nMaterial: Premium"}
              rows="5"
            />
          </div>

          <div className="listing-field">
            <label>Product Features</label>
            <textarea
              name="features"
              value={form.features}
              onChange={handleChange}
              placeholder={"Premium quality\nDurable design\nEasy to use"}
              rows="5"
            />
          </div>
        </section>

        {/* Order Settings */}
        <section className="listing-section">
          <div className="listing-section-title">
            <Package size={21} />
            <div>
              <h2>Order & Policy Settings</h2>
              <p>Configure WhatsApp and customer policies.</p>
            </div>
          </div>

          <div className="listing-field">
            <label>WhatsApp Number *</label>
            <input
              name="whatsappNumber"
              value={form.whatsappNumber}
              onChange={handleChange}
              placeholder="923001234567"
              required
            />
          </div>

          <div className="listing-grid">
            
<div className="listing-field">
  <label>Payment Method *</label>

  <select
    name="paymentMethod"
    value={form.paymentMethod}
    onChange={handleChange}
    required
    disabled={paymentLoading}
  >
    <option value="">
      {paymentLoading ? "Loading payment methods..." : "Select payment method"}
    </option>

    {paymentMethods.map((method) => (
      <option key={method.id} value={method.id}>
        {method.name}
      </option>
    ))}
  </select>

  {!paymentLoading && paymentMethods.length === 0 && (
    <small>No active payment methods found. Add one from Admin Panel.</small>
  )}
</div>


            
<div className="listing-field">
  <label>Return Policy *</label>

  <select
    name="returnPolicy"
    value={form.returnPolicy}
    onChange={handleChange}
    required
    disabled={policyLoading}
  >
    <option value="">
      {policyLoading ? "Loading return policies..." : "Select return policy"}
    </option>

    {returnPolicies.map((policy) => (
      <option key={policy.id} value={policy.id}>
        {policy.title}
      </option>
    ))}
  </select>

  {!policyLoading && returnPolicies.length === 0 && (
    <small>No active return policies found. Add one from Admin Panel.</small>
  )}
</div>


          </div>
        </section>

        {/* SEO */}
        <section className="listing-section">
          <div className="listing-section-title">
            <Search size={21} />
            <div>
              <h2>SEO Settings</h2>
              <p>Optimize your product for Google search.</p>
            </div>
          </div>

          <div className="listing-field">
            <label>SEO Title</label>
            <input
              name="seoTitle"
              value={form.seoTitle}
              onChange={handleChange}
              placeholder="Product SEO title"
              maxLength="70"
            />
            <small>{form.seoTitle.length}/70 characters</small>
          </div>

          <div className="listing-field">
            <label>SEO Description</label>
            <textarea
              name="seoDescription"
              value={form.seoDescription}
              onChange={handleChange}
              placeholder="Write a search engine description..."
              rows="3"
              maxLength="160"
            />
            <small>{form.seoDescription.length}/160 characters</small>
          </div>

          <div className="listing-field">
            <label>Focus Keyword</label>
            <input
              name="focusKeyword"
              value={form.focusKeyword}
              onChange={handleChange}
              placeholder="e.g. wireless headphones"
            />
          </div>
        </section>

        <div className="listing-actions">
          <Link to="/admin" className="listing-cancel">
            Cancel
          </Link>

          
<button
  type="submit"
  className="listing-submit-btn"
  disabled={isSubmitting}
>
  <Save size={18} />
  {isSubmitting ? "Saving Product..." : "Save Listing"}
</button>

        </div>

      </form>
    </div>
  );
}
