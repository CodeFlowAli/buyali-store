
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Tags,
  CreditCard,
  RotateCcw,
  LogOut,
  Store,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const { profile, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };
  const [stats, setStats] = useState({
  products: 0,
  categories: 0,
  paymentMethods: 0,
  returnPolicies: 0,
});

const [statsLoading, setStatsLoading] = useState(true);

useEffect(() => {
  const fetchStats = async () => {
    const tables = [
      "products",
      "categories",
      "payment_methods",
      "return_policies",
    ];

    const results = await Promise.all(
      tables.map((table) =>
        supabase
          .from(table)
          .select("*", { count: "exact", head: true })
      )
    );

    results.forEach((result, index) => {
      if (result.error) {
        console.error(`Error loading ${tables[index]}:`, result.error);
      }
    });

    setStats({
      products: results[0].count ?? 0,
      categories: results[1].count ?? 0,
      paymentMethods: results[2].count ?? 0,
      returnPolicies: results[3].count ?? 0,
    });

    setStatsLoading(false);
  };

  fetchStats();
}, []);

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <Link to="/" className="admin-brand">
          <Store size={25} />
          <span>BuyAli Admin</span>
        </Link>

        <nav className="admin-sidebar-nav">
          <Link to="/admin" className="active">
            <LayoutDashboard size={19} />
            Dashboard
          </Link>

          <Link to="/admin/products">
  <Package size={18} />
  <span>Products</span>
</Link>

          <Link to="/admin/products/create">
            <PlusCircle size={19} />
            Create Listing
          </Link>

          <Link to="/admin/categories">
            <Tags size={19} />
            Categories
          </Link>

          <Link to="/admin/payment-methods">
            <CreditCard size={19} />
            Payment Methods
          </Link>

          <Link to="/admin/return-policies">
            <RotateCcw size={19} />
            Return Policies
          </Link>
        </nav>

        <button className="admin-logout" onClick={handleLogout}>
          <LogOut size={19} />
          Logout
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <h1>Dashboard</h1>
            <p>Manage your BuyAli store</p>
          </div>

          <div className="admin-user">
            <div className="admin-avatar">
              {(profile?.full_name || "A").charAt(0).toUpperCase()}
            </div>
            <span>{profile?.full_name || "Admin"}</span>
          </div>
        </header>

        <section className="admin-welcome">
          <h2>Welcome to BuyAli 👋</h2>
          <p>Your store management dashboard is ready.</p>
        </section>

       
<section className="admin-stats">
  <div className="admin-stat-card">
    <Package size={25} />
    <h3>Products</h3>
    <strong>{statsLoading ? "..." : stats.products}</strong>
    <span>Total products in your store</span>
  </div>

  <div className="admin-stat-card">
    <Tags size={25} />
    <h3>Categories</h3>
    <strong>{statsLoading ? "..." : stats.categories}</strong>
    <span>Product categories</span>
  </div>

  <div className="admin-stat-card">
    <CreditCard size={25} />
    <h3>Payment Methods</h3>
    <strong>{statsLoading ? "..." : stats.paymentMethods}</strong>
    <span>Available payment options</span>
  </div>

  <div className="admin-stat-card">
    <RotateCcw size={25} />
    <h3>Return Policies</h3>
    <strong>{statsLoading ? "..." : stats.returnPolicies}</strong>
    <span>Available return policies</span>
  </div>
</section>

      </main>
    </div>
  );
}
