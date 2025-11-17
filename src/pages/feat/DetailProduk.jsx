import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import DynamicBreadcrumb from "../../components/DynamicBreadcrumb";
import Card from "../../components/CardShoes";
import api from "../../api/axios";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

// 1. Komponen baru untuk Notifikasi
const Notification = ({ message, type, show }) => {
  if (!show) return null;

  const baseClasses =
    "fixed top-5 right-5 z-50 p-4 rounded-lg shadow-lg text-white transition-all duration-300 ease-in-out";
  const typeClasses = type === "success" ? "bg-green-600" : "bg-red-600";

  return <div className={`${baseClasses} ${typeClasses}`}>{message}</div>;
};

export default function DetailProduk() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);

  const [isWishlisted, setIsWishlisted] = useState(false);

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    // Fungsi untuk mengambil data produk utama
    const fetchProductData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/products/${productId}`);

        const fetchedProduct = response.data;
        if (typeof fetchedProduct.specifications === "string") {
          fetchedProduct.specifications = JSON.parse(
            fetchedProduct.specifications
          );
        }

        setProduct(fetchedProduct);
        setIsWishlisted(fetchedProduct.isWishlist || false);

        if (
          fetchedProduct.imageGallery &&
          fetchedProduct.imageGallery.length > 0
        ) {
          // Rakit URL lengkap untuk gambar
          const fullImageUrl = `${
            import.meta.env.VITE_API_BASE_URL
          }/${fetchedProduct.imageGallery[0].replace(/\\/g, "/")}`;
          setActiveImage(fullImageUrl);
        }
      } catch (err) {
        console.error("Gagal mengambil data produk:", err);
        setError("Produk tidak dapat ditemukan atau terjadi kesalahan server.");
      } finally {
        setLoading(false);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const response = await api.get(`/products/${productId}/rekomendasi`);
        setRecommendations(response.data);
      } catch (err) {
        console.error("Gagal mengambil rekomendasi:", err);
      }
    };

    fetchProductData();
    fetchRecommendations();
  }, [productId]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error)
    return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!product)
    return <div className="text-center py-20">Produk tidak ditemukan!</div>;

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setNotification({
        show: true,
        message: "Silakan pilih ukuran terlebih dahulu!",
        type: "error",
      });
      setTimeout(
        () => setNotification({ show: false, message: "", type: "" }),
        3000
      );
      return;
    }

    try {
      const selectedVariant = product.variants.find(
        (v) => v.size === selectedSize
      );
      if (!selectedVariant) {
        throw new Error("Varian produk tidak ditemukan.");
      }
      const cartItem = {
        productVariantId: selectedVariant.variantId,
        quantity: quantity,
      };

      await api.post("/cart", cartItem);

      // Tampilkan notifikasi sukses
      setNotification({
        show: true,
        message: `${product.name} ditambahkan ke keranjang!`,
        type: "success",
      });

      // menyembunyikan notifikasi setelah 3 detik
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
        navigate("/kategori/shopcart");
      }, 3000);
    } catch (err) {
      console.error("Gagal menambahkan ke keranjang:", err);
      const errorMessage =
        err.response?.data?.message || "Gagal menambahkan item.";

      // menampilkan notifikasi error
      setNotification({ show: true, message: errorMessage, type: "error" });
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);

      if (err.response && err.response.status === 401) {
        setTimeout(() => navigate("/login"), 1500);
      }
    }
  };
  const handleWishlistToggle = async () => {
    // menyimpan state sebelum diubah
    const originalWishlistStatus = isWishlisted;

    setIsWishlisted(!originalWishlistStatus);

    try {
      if (!originalWishlistStatus) {
        //menambahkan wishlist
        await api.post("/wishlist", { productId: product.id });
      } else {
        //menghapus wishlist
        await api.delete(`/wishlist/${product.id}`);
      }
    } catch (err) {
      console.error("Gagal update wishlist:", err);

      setIsWishlisted(originalWishlistStatus);
      const errorMessage =
        err.response?.data?.message || "Gagal memperbarui wishlist.";
      alert(errorMessage);
    }
  };

  return (
    <div className="bg-white">
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <DynamicBreadcrumb />
        </div>

        {/* --- BAGIAN UTAMA PRODUK --- */}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* --- KOLOM KIRI: GALERI GAMBAR --- */}

          <div className="w-full lg:w-1/2 flex flex-col-reverse sm:flex-row gap-4">
            <div className="flex sm:flex-col gap-3 justify-center">
              {product.imageGallery.map((imgUrl, index) => (
                <div
                  key={index}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`p-1 rounded-lg cursor-pointer border-2 ${
                    activeImage === imgUrl
                      ? "border-black"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
            <div className="flex-1 bg-gray-100 rounded-lg flex items-center justify-center p-4">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full max-w-sm h-auto object-contain"
              />
            </div>
          </div>

          {/* --- KOLOM KANAN: DETAIL INFO PRODUK --- */}

          <div className="w-full lg:w-1/2 bg-gray-100 rounded-lg p-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-sm uppercase text-gray-600">
                  {product.brand}
                </h2>
                <h1 className="text-2xl font-bold text-gray-900 mt-1">
                  {product.name}
                </h1>
              </div>

              <button
                onClick={handleWishlistToggle}
                aria-label="Toggle Wishlist"
              >
                <Heart
                  className={`w-7 h-7 transition-colors ${
                    isWishlisted
                      ? "fill-red-500 stroke-red-500"
                      : "text-gray-500 hover:text-red-500"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center mt-3 text-sm text-gray-500">
              <span>({product.rating.toFixed(1)})</span>
              <span className="mx-2 text-gray-300">|</span>
              <span>{product.reviewCount} Penilaian</span>
              <span className="mx-2 text-gray-300">|</span>
              <span>{product.sold} Terjual</span>
            </div>

            <p className="text-4xl font-bold text-gray-900 my-6">
              Rp {product.price}
            </p>

            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3">Pilih Ukuran</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.variantId}
                      onClick={() => setSelectedSize(variant.size)}
                      disabled={variant.stock === 0}
                      className={`px-4 py-2 border rounded-md text-sm transition-colors ${
                        selectedSize === variant.size
                          ? "bg-black text-white border-black"
                          : "bg-white text-black border-gray-300"
                      } ${
                        variant.stock === 0
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed line-through"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      {variant.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center space-x-4 mb-8">
              <div className="flex items-center border border-gray-300 rounded-full">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 font-bold"
                >
                  -
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="w-12 text-center bg-transparent"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 font-bold"
                >
                  +
                </button>
              </div>
              <p className="text-sm text-gray-500">
                Tersedia {product.stock} buah
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Tombol Wishlist */}
              <button
                onClick={handleWishlistToggle}
                className="w-1/2 border border-black text-black py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                </svg>
                Wishlist
              </button>
              {/* Tombol Tambah ke Keranjang */}
              <button
                onClick={handleAddToCart}
                className="w-1/2 bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
              >
                Tambah ke Keranjang
              </button>
            </div>

            <div className="mt-6 border-t pt-4 text-sm text-gray-600 space-y-2">
              <p>Garansi: 1 Bulan</p>
            </div>
          </div>
        </div>

        {/* BAGIAN DESKRIPSI & SPESIFIKASI */}
        <div className="mt-16">
          <h3 className="text-xl font-semibold mb-4">
            Deskripsi & Spesifikasi
          </h3>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {typeof product.specifications === "object" &&
              Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex border-b py-2">
                  <span className="w-1/3 text-gray-500">{key}</span>
                  <span className="w-2/3 font-medium text-gray-800">
                    {value}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* BAGIAN REKOMENDASI PRODUK */}
        <div className="mt-16">
          <h3 className="text-xl font-semibold mb-4">
            Rekomendasi Produk Serupa
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendations.map((p) => (
              <Link key={p.id} to={`/produk/${p.id}`}>
                <Card
                  name={p.name}
                  price={`Rp${p.price.toLocaleString("id-ID")}`}
                  rating={p.rating || "N/A"}
                  imageUrl={
                    p.images && p.images.length > 0 ? p.images[0].image_url : ""
                  }
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
