
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { ArrowLeft, Save, LoaderCircle } from "lucide-react";
import "../styles/EditListing.css";

function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  
const [categories, setCategories] = useState([]);
const [paymentMethods, setPaymentMethods] = useState([]);
const [returnPolicies, setReturnPolicies] = useState([]);
const [loadingOptions, setLoadingOptions] = useState(true);


  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        setError(error?.message || "Product not found.");
        setLoading(false);
        return;
      }

      setForm({
        title: data.title || "",
        shortDescription: data.short_description || "",
        description: data.description || "",
        category: data.category_id || "",
        price: data.price ?? "",
        oldPrice: data.old_price ?? "",
        stock: data.stock ?? "",
        whatsappNumber: data.whatsapp_number || "",
        paymentMethod: data.payment_method_id || "",
        returnPolicy: data.return_policy_id || "",
        videoUrl: data.video_url || "",
        specifications: data.specifications || "",
        features: data.features || "",
        seoTitle: data.seo_title || "",
        seoDescription: data.seo_description || "",
        focusKeyword: data.focus_keyword || "",
      });

      setExistingImages(data.images || []);
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  

useEffect(() => {
  const fetchOptions = async () => {
    setLoadingOptions(true);

    const [categoriesResult, paymentsResult, policiesResult] =
      await Promise.all([
        supabase
          .from("categories")
          .select("id, name")
          .order("name"),

        supabase
          .from("payment_methods")
          .select("id, name")
          .eq("is_active", true)
          .order("name"),

        supabase
          .from("return_policies")
          .select("id, title")
          .eq("is_active", true)
          .order("title"),
      ]);

    if (categoriesResult.error) {
      console.error(categoriesResult.error.message);
    } else {
      setCategories(categoriesResult.data || []);
    }

    if (paymentsResult.error) {
      console.error(paymentsResult.error.message);
    } else {
      setPaymentMethods(paymentsResult.data || []);
    }

    if (policiesResult.error) {
      console.error(policiesResult.error.message);
    } else {
      setReturnPolicies(policiesResult.data || []);
    }

    setLoadingOptions(false);
  };

  fetchOptions();
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  
const handleNewImages = (e) => {
  const selectedFiles = Array.from(e.target.files || []);
  setNewImages((current) => [...current, ...selectedFiles]);
  e.target.value = "";
};

const removeExistingImage = (index) => {
  setExistingImages((current) =>
    current.filter((_, i) => i !== index)
  );
};

const removeNewImage = (index) => {
  setNewImages((current) =>
    current.filter((_, i) => i !== index)
  );
};




const handleUpdate = async () => {
  if (saving) return;

  setSaving(true);

  try {
    // Upload new images
    const uploadedUrls = await Promise.all(
      newImages.map(async (image) => {
        const safeName = image.name.replace(/[^a-zA-Z0-9._-]/g, "-");
        const filePath = `products/${crypto.randomUUID()}-${safeName}`;

        const { error } = await supabase.storage
          .from("product-media")
          .upload(filePath, image);

        if (error) throw error;

        const { data } = supabase.storage
          .from("product-media")
          .getPublicUrl(filePath);

        return data.publicUrl;
      })
    );

    // Keep existing images and add new images
    const finalImages = [...existingImages, ...uploadedUrls];

    // Update product in database
    const { error } = await supabase
      .from("products")
      .update({
        title: form.title.trim(),
        short_description: form.shortDescription.trim(),
        description: form.description.trim(),
        category_id: form.category || null,
        price: Number(form.price),
        old_price: form.oldPrice ? Number(form.oldPrice) : null,
        stock: Number(form.stock),
        images: finalImages,
        video_url: form.videoUrl.trim() || null,
        whatsapp_number: form.whatsappNumber.trim(),
        payment_method_id: form.paymentMethod || null,
        return_policy_id: form.returnPolicy || null,
        specifications: form.specifications.trim(),
        features: form.features.trim(),
        seo_title: form.seoTitle.trim(),
        seo_description: form.seoDescription.trim(),
        focus_keyword: form.focusKeyword.trim(),
      })
      .eq("id", id);

    if (error) throw error;

    alert("Product updated successfully!");

    navigate("/admin/products");

  } catch (error) {
    console.error("Product update error:", error);
    alert(`Update failed: ${error.message}`);
  } finally {
    setSaving(false);
  }
};




  if (loading) {
    return <div style={{ padding: 50 }}>Loading product...</div>;
  }

  if (error) {
    return <div style={{ padding: 50 }}>Error: {error}</div>;
  }

  return (
    <div className="edit-listing-page">
      <button
        type="button"
        onClick={() => navigate("/admin/products")}
      >
        <ArrowLeft size={18} /> Back to Products
      </button>

      <h1>Edit Product</h1>

      <div className="edit-listing-form">
        <label>Product Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
        />

        <label>Short Description</label>
        <textarea
          name="shortDescription"
          value={form.shortDescription}
          onChange={handleChange}
        />

        <label>Full Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        />
        
<label>Category</label>
<select
  name="category"
  value={form.category}
  onChange={handleChange}
  disabled={loadingOptions}
>
  <option value="">
    {loadingOptions ? "Loading categories..." : "Select category"}
  </option>

  {categories.map((category) => (
    <option key={category.id} value={category.id}>
      {category.name}
    </option>
  ))}
</select>


        <label>Price</label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
        />

        <label>Old Price</label>
        <input
          type="number"
          name="oldPrice"
          value={form.oldPrice}
          onChange={handleChange}
        />

        <label>Stock</label>
        <input
          type="number"
          name="stock"
          value={form.stock}
          onChange={handleChange}
        />
        
<label>Payment Method</label>
<select
  name="paymentMethod"
  value={form.paymentMethod}
  onChange={handleChange}
  disabled={loadingOptions}
>
  <option value="">
    {loadingOptions ? "Loading payment methods..." : "Select payment method"}
  </option>

  {paymentMethods.map((method) => (
    <option key={method.id} value={method.id}>
      {method.name}
    </option>
  ))}
</select>

<label>Return Policy</label>
<select
  name="returnPolicy"
  value={form.returnPolicy}
  onChange={handleChange}
  disabled={loadingOptions}
>
  <option value="">
    {loadingOptions ? "Loading return policies..." : "Select return policy"}
  </option>

  {returnPolicies.map((policy) => (
    <option key={policy.id} value={policy.id}>
      {policy.title}
    </option>
  ))}
</select>


        <label>WhatsApp Number</label>
        <input
          name="whatsappNumber"
          value={form.whatsappNumber}
          onChange={handleChange}
        />
        
<label>Video URL</label>
<input
  name="videoUrl"
  value={form.videoUrl}
  onChange={handleChange}
  placeholder="Enter product video URL"
/>

<label>Specifications</label>
<textarea
  name="specifications"
  value={form.specifications}
  onChange={handleChange}
  placeholder="Enter product specifications"
/>

<label>Features</label>
<textarea
  name="features"
  value={form.features}
  onChange={handleChange}
  placeholder="Enter product features"
/>

<label>SEO Title</label>
<input
  name="seoTitle"
  value={form.seoTitle}
  onChange={handleChange}
  maxLength={70}
/>

<label>SEO Description</label>
<textarea
  name="seoDescription"
  value={form.seoDescription}
  onChange={handleChange}
  maxLength={160}
/>

<label>Focus Keyword</label>
<input
  name="focusKeyword"
  value={form.focusKeyword}
  onChange={handleChange}
/>


        <h3>Existing Product Images</h3>

        
<h3>Product Images</h3>

<div className="edit-existing-images">
  {existingImages.map((image, index) => (
    <div className="edit-image-item" key={`${image}-${index}`}>
      <img src={image} alt={`Product ${index + 1}`} />

      <button
        type="button"
        onClick={() => removeExistingImage(index)}
      >
        Remove
      </button>
    </div>
  ))}

  {newImages.map((image, index) => (
    <div className="edit-image-item" key={`${image.name}-${index}`}>
      <img
        src={URL.createObjectURL(image)}
        alt={image.name}
      />

      <button
        type="button"
        onClick={() => removeNewImage(index)}
      >
        Remove
      </button>
    </div>
  ))}
</div>

<label>Add New Images</label>

<input
  type="file"
  accept="image/*"
  multiple
  onChange={handleNewImages}
/>

<button
  type="button"
  onClick={handleUpdate}
  disabled={saving}
>
  {saving ? (
    <>
      <LoaderCircle size={18} />
      Updating Product...
    </>
  ) : (
    <>
      <Save size={18} />
      Update Product
    </>
  )}
</button>


      </div>
    </div>
  );
}

export default EditListing;
