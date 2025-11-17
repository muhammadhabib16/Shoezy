import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Modal from "./Modal";

export default function MenuIcons() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsProfileModalOpen(false);
    navigate("/login");
  };

  return (
    <>
      {/* --- Ikon untuk Desktop --- */}
      <div className="hidden md:flex justify-center items-center space-x-4">
        {/* Ikon Wishlist */}
        <Link
          to="/wishlist"
          className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </Link>

        {/* Ikon Keranjang */}
        <Link
          to="/kategori/shopcart"
          className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
        </Link>

        {/* Ikon Profil */}
        <button
          onClick={() => setIsProfileModalOpen(true)}
          className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </button>
      </div>

      {/* --- Ikon untuk Mobile (Hamburger Menu) --- */}
      <div className="md:hidden">
        <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </div>

      {/* --- Modal Profil --- */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      >
        {isAuthenticated ? (
          // Tampilan jika SUDAH LOGIN
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">
              Halo, {user?.fullName || "Pengguna"}!
            </h2>
            <p className="text-gray-600 mb-6">
              Apa yang ingin Anda lakukan selanjutnya?
            </p>
            <div className="space-y-3">
              <Link
                to="/history"
                onClick={() => setIsProfileModalOpen(false)}
                className="block w-full text-center bg-gray-100 py-2 rounded-lg hover:bg-gray-200"
              >
                Riwayat Pesanan
              </Link>
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Anda Belum Login</h2>
            <p className="text-gray-600 mb-6">
              Silakan login atau daftar untuk melanjutkan.
            </p>
            <div className="flex gap-4">
              <Link
                to="/login"
                onClick={() => setIsProfileModalOpen(false)}
                className="flex-1 text-center bg-black text-white py-2 rounded-lg hover:bg-gray-800"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsProfileModalOpen(false)}
                className="flex-1 text-center bg-gray-100 py-2 rounded-lg hover:bg-gray-200"
              >
                Daftar
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
