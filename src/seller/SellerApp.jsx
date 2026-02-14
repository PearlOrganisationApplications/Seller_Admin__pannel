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

export default function SellerApp() {
  return (
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
      </Route>
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
}