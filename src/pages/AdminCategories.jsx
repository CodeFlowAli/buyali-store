
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Plus, Pencil, Trash2, X, Tag } from "lucide-react";
import "../styles/AdminCategories.css";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  
const [paymentMethods, setPaymentMethods] = useState([]);
const [returnPolicies, setReturnPolicies] = useState([]);

const [paymentLoading, setPaymentLoading] = useState(true);
const [policyLoading, setPolicyLoading] = useState(true);

  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("categories")
      .select("id, name, created_at")
      .order("name");

    if (error) {
      setError(error.message);
    } else {
      setCategories(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);


  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoryName = name.trim();

    if (!categoryName) return;

    setSaving(true);
    setError("");
    setMessage("");

    let result;

    if (editingId) {
      result = await supabase
        .from("categories")
        .update({ name: categoryName })
        .eq("id", editingId);
    } else {
      result = await supabase
        .from("categories")
        .insert({ name: categoryName });
    }

    if (result.error) {
      setError(result.error.message);
    } else {
      setName("");
      setEditingId(null);
      setMessage(editingId ? "Category updated successfully!" : "Category added successfully!");
      await fetchCategories();
    }

    setSaving(false);
  };

  const handleEdit = (category) => {
    setName(category.name);
    setEditingId(category.id);
    setMessage("");
    setError("");
  };

  const cancelEdit = () => {
    setName("");
    setEditingId(null);
    setError("");
    setMessage("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      setError(error.message);
    } else {
      setMessage("Category deleted successfully!");
      await fetchCategories();
    }
  };

  return (
    <div className="admin-categories">
      <div className="categories-header">
        <div>
          <span className="categories-eyebrow">PRODUCT MANAGEMENT</span>
          <h1>Categories</h1>
          <p>Manage the categories used in your product listings.</p>
        </div>

        <div className="categories-count">
          <Tag size={20} />
          <span>{categories.length} Categories</span>
        </div>
      </div>

      <div className="categories-content">
        <form className="category-form" onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit Category" : "Add New Category"}</h2>

          <label htmlFor="category-name">Category Name</label>

          <input
            id="category-name"
            type="text"
            placeholder="e.g. Electronics"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            required
          />

          <div className="category-form-actions">
            <button type="submit" disabled={saving}>
              <Plus size={18} />
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Category"
                  : "Add Category"}
            </button>

            {editingId && (
              <button
                type="button"
                className="category-cancel-btn"
                onClick={cancelEdit}
              >
                <X size={18} />
                Cancel
              </button>
            )}
          </div>

          {message && <p className="category-success">{message}</p>}
          {error && <p className="category-error">{error}</p>}
        </form>

        <div className="category-list">
          <div className="category-list-header">
            <h2>All Categories</h2>
            <span>{categories.length} total</span>
          </div>

          {loading ? (
            <p className="category-empty">Loading categories...</p>
          ) : categories.length === 0 ? (
            <div className="category-empty">
              <Tag size={30} />
              <h3>No categories yet</h3>
              <p>Add your first category using the form.</p>
            </div>
          ) : (
            <div className="category-items">
              {categories.map((category) => (
                <div className="category-item" key={category.id}>
                  <div className="category-item-info">
                    <div className="category-icon">
                      <Tag size={18} />
                    </div>
                    <span>{category.name}</span>
                  </div>

                  <div className="category-item-actions">
                    <button
                      type="button"
                      title="Edit category"
                      onClick={() => handleEdit(category)}
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      type="button"
                      className="category-delete-btn"
                      title="Delete category"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
