import React, { useState, useEffect } from "react";
import heroimage from "../../assets/img/heroimage.jpg";
import bannerimage from "../../assets/img/bannerimage.jpg";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import Card from "../../components/CardShoes";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Homepage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get("/products?limit=8");
        setProducts(response.data.products);
      } catch (err) {
        console.error("Gagal mengambil produk homepage:", err);
        setError("Gagal memuat produk unggulan.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleWishlistToggle = async (productId, currentStatus) => {
    if (!isAuthenticated) {
      alert("Anda harus login untuk menggunakan wishlist.");
      navigate("/login");
      return;
    }
    try {
      if (currentStatus) {
        await api.delete(`/wishlist/${productId}`);
      } else {
        await api.post("/wishlist", { productId });
      }
      setProducts(
        products.map((p) =>
          p.id === productId ? { ...p, isWishlisted: !currentStatus } : p
        )
      );
    } catch (err) {
      console.error("Gagal update wishlist:", err);
      alert("Gagal memperbarui wishlist.");
    }
  };

  const renderProductContent = () => {
    if (loading) return <p className="text-center py-10">Memuat produk...</p>;
    if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
    if (!products || products.length === 0)
      return (
        <p className="text-center py-10">Tidak ada produk untuk ditampilkan.</p>
      );

    return products.map((product) => (
      <Card
        key={product.id}
        product={product} // <-- KIRIM SELURUH OBJEK PRODUK
        isWishlisted={product.isWishlisted}
        onWishlistToggle={() =>
          handleWishlistToggle(product.id, product.isWishlisted)
        }
      />
    ));
  };

  return (
    <>
      <div className="bg-black w-full max-h-full">
        <div className="bg-white w-full min-h-screen mx-auto flex flex-col">
          {/* hero-section  */}
          <div
            className="relative w-full h-[75vh] bg-cover bg-center mx-auto"
            style={{ backgroundImage: `url(${heroimage})` }}
          >
            <div className="absolute inset-0 bg-black opacity-50">
              <div className="relative z-10 flex flex-col justify-between h-full p-6">
                <div className="p-8 md:p-12">
                  <h1 className="text-white text-4xl md:text-5xl font-bold">
                    Every Walk <br />
                    Have Impact
                  </h1>
                </div>
              </div>
            </div>
          </div>
          {/* end-hero-section */}

          {/* content-section  */}
          <div className="flex items-center justify-center p-6 py-16">
            <p className="text-gray-700 text-center text-xl font-medium max-w-3xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <div
            className="relative w-full h-[45vh] bg-cover bg-center mx-auto"
            style={{ backgroundImage: `url(${bannerimage})` }}
          >
            <div className="absolute inset-0 bg-black opacity-50"></div>
          </div>

          <div className="container mx-auto">
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <h2 className="font-semibold text-4xl text-center">
                Crafter To Be Noticed
              </h2>
              <h3 className="font-medium text-center text-gray-600 mt-4 max-w-2xl">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </h3>
            </div>

            {/* Card Section */}
            <div className="px-4 pb-16">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {renderProductContent()}
              </div>
            </div>

            {/* End of Card Section */}

            <Link to={isAuthenticated ? `/kategori` : `/kategoripublic`}>
              {" "}
              <div className="flex justify-center items-center py-20">
                <button className="border-black border-2 font-medium w-3/5 md:w-1/4 text-black px-6 py-2.5 rounded-2xl hover:bg-black hover:text-white transition-colors">
                  Lihat Hasil Lainnya
                </button>
              </div>{" "}
            </Link>

            {/* Exclusive Section  */}
            <section className="pb-20">
              <div className="flex flex-col lg:flex-row lg:justify-between items-center px-6 md:px-10 gap-12">
                <div className="w-full lg:w-2/3 flex flex-col items-center lg:items-start text-center lg:text-left gap-8">
                  <h1 className="text-4xl lg:text-5xl font-medium">
                    Exclusive Only For You
                  </h1>
                  <p className="max-w-xl text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam.
                  </p>
                  <Link to={isAuthenticated ? `/kategori` : `/kategoripublic`}>
                    <button className="border-black border-2 text-black px-8 py-2 rounded-full hover:bg-black hover:text-white transition-colors duration-300 font-semibold">
                      Check it Out
                    </button>
                  </Link>
                </div>
                <div className="w-full lg:w-1/3 flex justify-center lg:justify-end">
                  <img
                    src="https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb"
                    alt="Exclusive Shoes"
                    className="w-full max-w-sm lg:max-w-md h-auto object-cover rounded-lg shadow-2xl"
                  />
                </div>
              </div>
            </section>
            {/* End of Exclusive Section */}
          </div>
        </div>
      </div>
    </>
  );
}
