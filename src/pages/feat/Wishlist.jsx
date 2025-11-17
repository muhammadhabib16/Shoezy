import React, { useState, useEffect } from "react";
import heroimage from "../../assets/img/heroimage.jpg";
import Card from "../../components/CardShoes";
import { Link } from "react-router-dom";
import api from "../../api/axios";

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/wishlist");
        setWishlistItems(response.data);
      } catch (err) {
        console.error("Gagal mengambil data wishlist:", err);
        if (err.response && err.response.status === 401) {
          setError("Anda harus login untuk melihat wishlist.");
        } else {
          setError("Gagal memuat wishlist. Silakan coba lagi.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = async (productId) => {
    const originalItems = [...wishlistItems];
    setWishlistItems(
      originalItems.filter((item) => item.Product.id !== productId)
    );
    try {
      await api.delete(`/wishlist/${productId}`);
    } catch (err) {
      console.error("Gagal menghapus dari wishlist:", err);
      setWishlistItems(originalItems);
      alert("Gagal menghapus item dari wishlist.");
    }
  };

  const renderWishlistContent = () => {
    if (loading) {
      return <p className="text-center py-10">Memuat wishlist...</p>;
    }
    if (error) {
      return <p className="text-center py-10 text-red-500">{error}</p>;
    }
    if (wishlistItems.length === 0) {
      return (
        <div className="text-center col-span-full py-10">
          <h2 className="text-2xl font-semibold mb-2">Wishlist Anda Kosong</h2>
          <p className="text-gray-600 mb-4">Ayo cari produk yang Anda sukai!</p>
          <Link
            to="/kategori"
            className="bg-black text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800"
          >
            Mulai Belanja
          </Link>
        </div>
      );
    }
    return wishlistItems.map((item) => {
      // PERBAIKAN 1: Ambil data produk dari objek 'item.Product'
      const productData = item.Product;
      if (!productData) return null;

      // PERBAIKAN 2: Proses URL gambar dari data yang benar
      const imageUrl =
        productData.images && productData.images.length > 0
          ? productData.images[0].image_url
          : "https://placehold.co/400x300/e2e8f0/333?text=No+Image";

      return (
        <Card
          key={item.id}
          product={productData} // Kirim seluruh objek produk ke Card
          isWishlisted={true}
          onWishlistToggle={() => handleRemoveFromWishlist(productData.id)}
        />
      );
    });
  };

  return (
    <>
      <div className="flex flex-col">
        {/* hero section */}
        <div
          className="relative w-full h-[50vh] bg-cover bg-center mx-auto"
          style={{ backgroundImage: `url(${heroimage})` }}
        >
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="flex items-end justify-start h-full p-10">
            <h1 className="text-white text-4xl font-bold">Wishlist Saya</h1>
          </div>
        </div>

        <div className="w-full bg-white min-h-[50vh]">
          <div className="container mx-auto p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10">
              {renderWishlistContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
