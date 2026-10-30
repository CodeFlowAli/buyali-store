
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Plus, Pencil, Trash2, X, CreditCard } from "lucide-react";
import "../styles/AdminPaymentMethods.css";

export default function AdminPaymentMethods() {
  const [methods, setMethods] = useState([]);
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchMethods = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("payment_methods")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setMethods(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const resetForm = () => {
    setName("");
    setDetails("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      name: name.trim(),
      details: details.trim(),
    };

    const result = editingId
      ? await supabase
          .from("payment_methods")
          .update(payload)
          .eq("id", editingId)
      : await supabase.from("payment_methods").insert(payload);

    if (result.error) {
      setError(result.error.message);
    } else {
      setMessage(
        editingId
          ? "Payment method updated successfully!"
          : "Payment method added successfully!"
      );
      resetForm();
      await fetchMethods();
    }

    setSaving(false);
  };

  const handleEdit = (method) => {
    setName(method.name);
    setDetails(method.details || "");
    setEditingId(method.id);
    setMessage("");
    setError("");
  };

  const handleToggle = async (method) => {
    setError("");
    setMessage("");

    const { error } = await supabase
      .from("payment_methods")
      .update({ is_active: !method.is_active })
      .eq("id", method.id);

    if (error) {
      setError(error.message);
    } else {
      await fetchMethods();
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this payment method? Products using it will keep their listings, but their payment method will become empty."
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    const { error } = await supabase
      .from("payment_methods")
      .delete()
      .eq("id", id);

    if (error) {
      setError(error.message);
    } else {
      setMessage("Payment method deleted successfully!");
      await fetchMethods();
    }
  };

  return (
    <div className="admin-payment-methods">
      <div className="payment-methods-header">
        <div>
          <span className="payment-eyebrow">ORDER SETTINGS</span>
          <h1>Payment Methods</h1>
          <p>Create and manage reusable payment options.</p>
        </div>

        <div className="payment-count">
          <CreditCard size={20} />
          <span>{methods.length} Methods</span>
        </div>
      </div>

      <div className="payment-methods-content">
        <form className="payment-form" onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit Payment Method" : "Add Payment Method"}</h2>

          <label htmlFor="payment-name">Payment Method Name *</label>
          <input
            id="payment-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Cash on Delivery"
            maxLength={80}
            required
          />

          <label htmlFor="payment-details">Payment Details</label>
          <textarea
            id="payment-details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Optional: account details or payment instructions"
            rows={4}
          />

          <div className="payment-form-actions">
            <button type="submit" disabled={saving}>
              <Plus size={18} />
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Method"
                  : "Add Method"}
            </button>

            {editingId && (
              <button
                type="button"
                className="payment-cancel-btn"
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

          {message && <p className="payment-success">{message}</p>}
          {error && <p className="payment-error">{error}</p>}
        </form>

        <div className="payment-list">
          <div className="payment-list-header">
            <h2>All Payment Methods</h2>
            <span>{methods.length} total</span>
          </div>

          {loading ? (
            <p className="payment-empty">Loading payment methods...</p>
          ) : methods.length === 0 ? (
            <div className="payment-empty">
              <CreditCard size={30} />
              <h3>No payment methods yet</h3>
              <p>Add your first payment method using the form.</p>
            </div>
          ) : (
            <div className="payment-items">
              {methods.map((method) => (
                <div className="payment-item" key={method.id}>
                  <div className="payment-item-info">
                    <div className="payment-icon">
                      <CreditCard size={19} />
                    </div>

                    <div>
                      <h3>{method.name}</h3>
                      <p>{method.details || "No additional details"}</p>
                      <span
                        className={`payment-status ${
                          method.is_active ? "active" : "inactive"
                        }`}
                      >
                        {method.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  <div className="payment-item-actions">
                    <button
                      type="button"
                      title="Edit"
                      onClick={() => handleEdit(method)}
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      type="button"
                      className="payment-toggle-btn"
                      onClick={() => handleToggle(method)}
                    >
                      {method.is_active ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      type="button"
                      className="payment-delete-btn"
                      title="Delete"
                      onClick={() => handleDelete(method.id)}
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
