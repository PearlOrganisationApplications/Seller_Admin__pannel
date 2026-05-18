import { Routes, Route, Navigate } from "react-router-dom";
import SellerLayout from "./layouts/SellerLayouts";
import SellerDashboard from "./pages/SellerDashboard";
import InventoryPage from "./pages/Inventory";
import ProductListing from "./pages/ProductListing";
import ListedProducts from "./pages/ListedProducts";
import Order from "./pages/Order";
import AllDetails from "./pages/Alldetails";
import RequestCertified from "./pages/RequestCertified";
import CertifiedProducts from "./pages/CertifiedProducts";
import ReviewRatingList from "./pages/ReviewRatingList";
import ReviewRatingDetail from "./pages/ReviewRatingDetail";
import SellerNotifications from "./pages/SellerNotifications";
import OrderManagment from "./pages/OrderManagment";
import PlatformRating from "./pages/PlatformRating";
import { Toaster } from "react-hot-toast"; // 1. Import Toaster
import Help from "./pages/Help/help";
import About from "./pages/About/abouts";

export default function SellerApp() {
  return (
    <>
      {/* 2. Define the Toast container here */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />

      <Routes>
        <Route element={<SellerLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SellerDashboard />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="product-listing" element={<ProductListing />} />
          <Route path="listed-products" element={<ListedProducts />} />
          <Route path="order-management" element={<Order />} />
          <Route path="all-details" element={<AllDetails />} />
          <Route path="request-certified" element={<RequestCertified />} />
          <Route path="certified-products" element={<CertifiedProducts />} />
          <Route path="reviews" element={<ReviewRatingList />} />
          <Route path="reviews/detail/:id" element={<ReviewRatingDetail />} />
          <Route path="notifications" element={<SellerNotifications />} />
          <Route path="managment" element={<OrderManagment />} />
          <Route path="help" element={<Help />} />
          <Route path="about" element={<About />} />

          <Route path="platform-rating" element={<PlatformRating />} />
        </Route>
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </>
  );
}
