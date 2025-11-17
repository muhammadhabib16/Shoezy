import React from "react";
import { Routes, Route } from "react-router-dom";

// Import komponen Layout dan Proteksi
import Layout from "./components/Layout";
import LayoutPublic from "./components/LayoutPublic";
import ProtectedRoute from "./components/ProtectedRoute";

// Import semua halaman
import Homepage from "./pages/feat/Homepage";
import Kategori from "./pages/feat/Kategori";
import DetailProduk from "./pages/feat/DetailProduk";
import Wishlist from "./pages/feat/Wishlist";
import ShopCart from "./pages/feat/ShopCart";
import Checkout from "./pages/feat/Checkout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ConfirmCode from "./pages/auth/ConfirmCode";
import ResetPassword from "./pages/auth/ResetPassword";
import ShopHistory from "./pages/feat/ShopHistory";
import DetailPesanan from "./pages/feat/DetailPesanan";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/confirmcode" element={<ConfirmCode />} />
      <Route path="/resetpassword" element={<ResetPassword />} />

      <Route element={<LayoutPublic />}>
        <Route path="/" element={<Homepage />} />
        <Route path="/kategoripublic" element={<Kategori />} />
        <Route path="/kategoripublic/:productId" element={<DetailProduk />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/kategori" element={<Kategori />} />
          <Route path="/kategori/:productId" element={<DetailProduk />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/kategori/shopcart" element={<ShopCart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/history" element={<ShopHistory />} />
          <Route path="/history/:orderId" element={<DetailPesanan />} />
        </Route>
      </Route>

      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}
