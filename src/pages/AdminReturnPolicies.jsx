
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Plus, Pencil, Trash2, X, RotateCcw } from "lucide-react";
import "../styles/AdminReturnPolicies.css";

export default function AdminReturnPolicies() {
  const [policies, setPolicies] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchPolicies = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("return_policies")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setPolicies(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) return;

    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      title: title.trim(),
      description: description.trim(),
    };

    const result = editingId
      ? await supabase
          .from("return_policies")
          .update(payload)
          .eq("id", editingId)
      : await supabase.from("return_policies").insert(payload);

    if (result.error) {
      setError(result.error.message);
    } else {
      setMessage(
        editingId
          ? "Return policy updated successfully!"
          : "Return policy added successfully!"
      );
      resetForm();
      await fetchPolicies();
    }

    setSaving(false);
  };

  const handleEdit = (policy) => {
    setTitle(policy.title);
    setDescription(policy.description);
    setEditingId(policy.id);
    setMessage("");
    setError("");
  };

  const handleToggle = async (policy) => {
    setError("");
    setMessage("");

    const { error } = await supabase
      .from("return_policies")
      .update({ is_active: !policy.is_active })
      .eq("id", policy.id);

    if (error) {
      setError(error.message);
    } else {
      await fetchPolicies();
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this return policy?"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    const { error } = await supabase
      .from("return_policies")
      .delete()
      .eq("id", id);

    if (error) {
      setError(error.message);
    } else {
      setMessage("Return policy deleted successfully!");
      await fetchPolicies();
    }
  };

  return (
    <div className="admin-return-policies">
      <div className="return-policies-header">
        <div>
          <span className="return-eyebrow">ORDER SETTINGS</span>
          <h1>Return Policies</h1>
          <p>Create and manage reusable product return policies.</p>
        </div>

        <div className="return-count">
          <RotateCcw size={20} />
          <span>{policies.length} Policies</span>
        </div>
      </div>

      <div className="return-policies-content">
        <form className="return-form" onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit Return Policy" : "Add Return Policy"}</h2>

          <label htmlFor="return-title">Policy Title *</label>
          <input
            id="return-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 7-Day Return Policy"
            maxLength={100}
            required
          />

          <label htmlFor="return-description">Policy Description *</label>
          <textarea
            id="return-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain the return conditions..."
            rows={6}
            required
          />

          <div className="return-form-actions">
            <button type="submit" disabled={saving}>
              <Plus size={18} />
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Policy"
                  : "Add Policy"}
            </button>

            {editingId && (
              <button
                type="button"
                className="return-cancel-btn"
                onClick={() => {
                  resetForm();
                  setMessage("");
                  setError("");
                }}
              >
                <X size={18} />
                Cancel
              </button>
            )}
          </div>

          {message && <p className="return-success">{message}</p>}
          {error && <p className="return-error">{error}</p>}
        </form>

        <div className="return-list">
          <div className="return-list-header">
            <h2>All Return Policies</h2>
            <span>{policies.length} total</span>
          </div>

          {loading ? (
            <p className="return-empty">Loading return policies...</p>
          ) : policies.length === 0 ? (
            <div className="return-empty">
              <RotateCcw size={30} />
              <h3>No return policies yet</h3>
              <p>Add your first return policy using the form.</p>
            </div>
          ) : (
            <div className="return-items">
              {policies.map((policy) => (
                <div className="return-item" key={policy.id}>
                  <div className="return-item-info">
                    <div className="return-icon">
                      <RotateCcw size={19} />
                    </div>

                    <div className="return-item-text">
                      <h3>{policy.title}</h3>
                      <p>{policy.description}</p>
                      <span
                        className={`return-status ${
                          policy.is_active ? "active" : "inactive"
                        }`}
                      >
                        {policy.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  <div className="return-item-actions">
                    <button
                      type="button"
                      title="Edit policy"
                      onClick={() => handleEdit(policy)}
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      type="button"
                      className="return-toggle-btn"
                      onClick={() => handleToggle(policy)}
                    >
                      {policy.is_active ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      type="button"
                      className="return-delete-btn"
                      title="Delete policy"
                      onClick={() => handleDelete(policy.id)}
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
