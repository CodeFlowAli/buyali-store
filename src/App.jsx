
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminRoute from "./components/AdminRoute";
import AdminCategories from "./pages/AdminCategories";
import AdminPaymentMethods from "./pages/AdminPaymentMethods";
import AdminReturnPolicies from "./pages/AdminReturnPolicies";
import AdminProducts from "./pages/AdminProducts";
import EditListing from "./pages/EditListing";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import CreateListing from "./pages/CreateListing";
import PrivacyPolicy from "./pages/PrivacyPolicy";

function App() {
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <Navbar />}

      <Routes>
        
        <Route path="/" element={<Home />} />

        <Route path="/products" element={<Products />} />

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />
        <Route
  path="/admin/categories"
  element={
    <AdminRoute>
      <AdminCategories />
    </AdminRoute>
  }
/>
<Route
  path="/admin/payment-methods"
  element={
    <AdminRoute>
      <AdminPaymentMethods />
    </AdminRoute>
  }
/>
<Route
  path="/admin/return-policies"
  element={
    <AdminRoute>
      <AdminReturnPolicies />
    </AdminRoute>
  }
/>
<Route
  path="/admin/products"
  element={
    <AdminRoute>
      <AdminProducts />
    </AdminRoute>
  }
/>
<Route
  path="/admin/products/edit/:id"
  element={
    <AdminRoute>
      <EditListing />
    </AdminRoute>
  }
/>


        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        {/* Admin Login */}
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* Protected Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Protected Create Listing */}
        <Route
          path="/admin/products/create"
          element={
            <AdminRoute>
              <CreateListing />
            </AdminRoute>
          }
        />

        {/* 404 Page */}
        <Route
          path="*"
          element={
            <h1
              style={{
                textAlign: "center",
                padding: "100px 20px",
              }}
            >
              404 - Page Not Found
            </h1>
          }
        />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
      

      {!isAdminPage && <Footer />}
    </>
  );
}

export default App;
