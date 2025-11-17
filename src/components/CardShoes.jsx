import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SizeSelectionModal from "./SizeSelectionModal"; // Pastikan path ini benar
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

// Helper component untuk menampilkan bintang rating
const StarRating = ({ rating }) => {
  const totalStars = 5;
  const numericRating = parseFloat(rating);
  const filledStars = !isNaN(numericRating) ? Math.round(numericRating) : 0;

  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => (
        <svg
          key={index}
          className={`w-4 h-4 ${
            index < filledStars ? "text-black" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-2 text-sm text-gray-500">({rating || "N/A"})</span>
    </div>
  );
};

export default function Card({ product, isWishlisted, onWishlistToggle }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  // Pengaman jika data produk belum siap
  if (!product) {
    return <div className="bg-gray-100 rounded-xl h-full animate-pulse"></div>;
  }

  const { name, brand, price, rating, image, id, variants } = product;
  const linkTo = isAuthenticated ? `/kategori/${id}` : `/kategoripublic/${id}`;

  const imageUrl = image
    ? `${import.meta.env.VITE_API_BASE_URL}/${image.replace(/\\/g, "/")}`
    : "https://placehold.co/400x300/e2e8f0/333?text=No+Image";

  // --- HANDLER UNTUK SETIAP AKSI ---

  // Aksi untuk navigasi ke detail produk
  const handleCardClick = () => {
    navigate(linkTo);
  };

  // Aksi untuk tombol wishlist
  const handleWishlistClick = (e) => {
    e.stopPropagation(); // Mencegah navigasi saat tombol ini diklik
    if (onWishlistToggle) {
      onWishlistToggle(product.id, isWishlisted);
    }
  };

  // Aksi untuk tombol checkout
  const handleCheckoutClick = (e) => {
    e.stopPropagation(); // Mencegah navigasi saat tombol ini diklik
    if (!isAuthenticated) {
      alert("Anda harus login untuk melakukan checkout.");
      navigate("/login");
      return;
    }
    setIsModalOpen(true);
  };

  // Aksi setelah ukuran dipilih di modal
  const handleSizeSelectedAndCheckout = async (selectedVariant) => {
    setIsModalOpen(false);
    if (!selectedVariant) {
      alert("Varian produk tidak ditemukan.");
      return;
    }
    try {
      // 1. Tambahkan item ke keranjang
      const cartPayload = {
        productVariantId: selectedVariant.variantId,
        quantity: 1,
      };
      await api.post("/cart", cartPayload);

      // 2. Ambil data alamat pengguna
      let shippingAddress = null;
      try {
        const addressResponse = await api.get("/addresses");
        shippingAddress = addressResponse.data;
      } catch (addressError) {
        // Jika alamat tidak ditemukan (404), biarkan null.
        // Halaman checkout akan menanganinya.
        if (addressError.response?.status !== 404) {
          throw addressError; // Lemparkan error lain
        }
        console.log(
          "Alamat tidak ditemukan, akan diminta di halaman checkout."
        );
      }

      // 3. Siapkan data lengkap untuk dibawa ke halaman checkout
      const checkoutData = {
        items: [
          {
            cartItemId: `temp-${id}-${selectedVariant.variantId}`,
            quantity: 1,
            price: price,
            size: selectedVariant.size,
            variantId: selectedVariant.variantId,
            stock: selectedVariant.stock,
            product: { id, name, image: imageUrl },
          },
        ],
        subtotal: price,
        shippingAddress: shippingAddress, // Sertakan alamat di sini
      };

      // 4. Arahkan ke halaman checkout
      navigate("/checkout", { state: { checkoutData } });
    } catch (err) {
      console.error("Gagal melanjutkan ke checkout:", err);
      alert(err.response?.data?.message || "Gagal melanjutkan ke checkout.");
    }
  };

  return (
    <>
      {/* PERBAIKAN: Gunakan div dengan onClick, bukan Link */}
      <div
        onClick={handleCardClick}
        className="bg-gray-200 rounded-xl overflow-hidden h-full flex flex-col group p-4 transition-all duration-300 hover:shadow-lg cursor-pointer"
      >
        <div className="w-full h-48 bg-white rounded-lg flex items-center justify-center mb-4 relative">
          <img
            src={imageUrl}
            alt={name || "Product Image"}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
          <button
            onClick={handleWishlistClick}
            className="absolute top-3 left-3 z-20 bg-white/80 backdrop-blur-sm rounded-full p-1.5 hover:bg-white transition-colors"
            aria-label="Toggle Wishlist"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              className={`w-5 h-5 transition-all duration-200 ${
                isWishlisted
                  ? "fill-red-500 stroke-red-500"
                  : "fill-none stroke-current"
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.099 3.75 3 5.765 3 8.25c0 7.229 9 12 9 12s9-4.771 9-12z"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col flex-grow">
          <div className="flex justify-between items-start gap-4 mb-3">
            <div className="flex-grow">
              <h2 className="font-bold text-lg text-black truncate">{name}</h2>
              <p className="text-sm text-gray-500">{brand}</p>
            </div>
            <div className="flex-shrink-0">
              <p className="font-bold text-lg text-black">{`Rp${price.toLocaleString(
                "id-ID"
              )}`}</p>
            </div>
          </div>

          <div className="mb-4">
            <StarRating rating={rating} />
          </div>

          <div className="mt-auto space-y-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(linkTo);
              }}
              className="w-full bg-white border border-gray-300 text-black px-4 py-2 rounded-full font-semibold hover:bg-gray-200 transition-colors"
            >
              Quick View
            </button>
            <button
              onClick={handleCheckoutClick}
              className="w-full bg-black text-white px-4 py-2 rounded-full font-semibold hover:bg-gray-800 transition-colors"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>

      <SizeSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCheckout={handleSizeSelectedAndCheckout}
        product={product}
      />
    </>
  );
}
