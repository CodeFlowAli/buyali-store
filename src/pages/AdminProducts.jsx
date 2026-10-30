
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  Package,
  Search,
  Eye,
  EyeOff,
  Trash2,
  RefreshCw,
  Pencil,
} from "lucide-react";

import "../styles/AdminProducts.css";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories(name)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Products error:", error.message);
      alert(error.message);
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const togglePublish = async (product) => {
    const newStatus = !product.is_published;

    setUpdatingId(product.id);

    const { error } = await supabase
      .from("products")
      .update({ is_published: newStatus })
      .eq("id", product.id);

    if (error) {
      alert(error.message);
    } else {
      setProducts((current) =>
        current.map((item) =>
          item.id === product.id
            ? { ...item, is_published: newStatus }
            : item
        )
      );
    }

    setUpdatingId(null);
  };

  const deleteProduct = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.title}"?`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      alert(error.message);
      return;
    }

    setProducts((current) =>
      current.filter((item) => item.id !== product.id)
    );

    alert("Product deleted successfully!");
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-products-page">
      <div className="admin-products-header">
        <div>
          <h1>Products Management</h1>
          <p>Manage your BuyAli product listings.</p>
        </div>

        <button
          className="admin-refresh-btn"
          onClick={fetchProducts}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      <div className="admin-products-stats">
        <div className="admin-product-stat">
          <Package size={22} />
          <div>
            <h3>{products.length}</h3>
            <p>Total Products</p>
          </div>
        </div>

        <div className="admin-product-stat">
          <Eye size={22} />
          <div>
            <h3>
              {products.filter((p) => p.is_published).length}
            </h3>
            <p>Published</p>
          </div>
        </div>

        <div className="admin-product-stat">
          <EyeOff size={22} />
          <div>
            <h3>
              {products.filter((p) => !p.is_published).length}
            </h3>
            <p>Drafts</p>
          </div>
        </div>
      </div>

      <div className="admin-products-toolbar">
        <div className="admin-products-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-products-table-wrapper">
        {loading ? (
          <div className="admin-products-message">
            Loading products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="admin-products-message">
            No products found.
          </div>
        ) : (
          <table className="admin-products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="admin-product-info">
                      {product.images?.[0] ? (
                        <img
  src={product.images?.[0] || ""}
  alt={product.title}
  loading="lazy"
  onError={(e) => {
    e.currentTarget.style.display = "none";
  }}
/>
                      ) : (
                        <div className="admin-product-placeholder">
                          <Package size={22} />
                        </div>
                      )}

                      <span>{product.title}</span>
                    </div>
                  </td>

                  <td>
                    {product.categories?.name || "Uncategorized"}
                  </td>

                  <td>Rs. {Number(product.price).toLocaleString()}</td>

                  <td>{product.stock}</td>

                  <td>
                    <span
                      className={
                        product.is_published
                          ? "product-status published"
                          : "product-status draft"
                      }
                    >
                      {product.is_published ? "Published" : "Draft"}
                    </span>
                  </td>

                  <td>
                    <div className="admin-product-actions">
                      
<button
  className="publish-action"
  onClick={() => togglePublish(product)}
  disabled={updatingId === product.id}
  title={product.is_published ? "Unpublish product" : "Publish product"}
>
  {updatingId === product.id ? (
    <RefreshCw size={17} />
  ) : product.is_published ? (
    <EyeOff size={17} />
  ) : (
    <Eye size={17} />
  )}
</button>

                      
<button
  className="edit-action"
  onClick={() =>
    window.location.href = `/admin/products/edit/${product.id}`
  }
  title="Edit product"
>
  <Pencil size={17} />
</button>


                      <button
                        className="delete-action"
                        onClick={() => deleteProduct(product)}
                        title="Delete product"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminProducts;
