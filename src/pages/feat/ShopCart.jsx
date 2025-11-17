import React, { useState, useEffect } from "react";
import DynamicBreadcrumb from "../../components/DynamicBreadcrumb";
import heroimage from "../../assets/img/heroimage.jpg";
import Modal from "../../components/Modal";
import AddressForm from "../../components/AddressForm";
import api from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
// Helper untuk format Rupiah
const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

export default function ShopCart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [existingAddress, setExistingAddress] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/cart");
        setCartItems(response.data);
      } catch (err) {
        console.error("Gagal mengambil data keranjang:", err);
        if (err.response?.status === 401) {
          setError("Anda harus login untuk melihat keranjang.");
        } else {
          setError("Gagal memuat keranjang belanja.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleQuantityChange = async (item, delta) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return;

    const originalCartItems = [...cartItems];
    const updatedCartItems = cartItems.map((cartItem) =>
      cartItem.cartItemId === item.cartItemId
        ? { ...cartItem, quantity: newQuantity }
        : cartItem
    );
    setCartItems(updatedCartItems);

    try {
      await api.put(`/cart/${item.variantId}`, { quantity: newQuantity });
    } catch (err) {
      console.error("Gagal update kuantitas:", err);
      alert(err.response?.data?.message || "Gagal memperbarui kuantitas item.");
      setCartItems(originalCartItems);
    }
  };

  const handleRemoveItem = async (item) => {
    const originalCartItems = [...cartItems];
    setCartItems(
      cartItems.filter((cartItem) => cartItem.cartItemId !== item.cartItemId)
    );

    try {
      await api.delete(`/cart/${item.variantId}`);
    } catch (err) {
      console.error("Gagal menghapus item:", err);
      alert(
        err.response?.data?.message || "Gagal menghapus item dari keranjang."
      );
      setCartItems(originalCartItems);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingCost = 25000;
  const grandTotal = subtotal + shippingCost;

  const handleCheckout = async () => {
    setIsCheckoutLoading(true);
    try {
      const response = await api.get("/addresses");
      const addressData = response.data;

      const checkoutData = {
        items: cartItems,
        subtotal,
        shippingCost,
        grandTotal,
        shippingAddress: addressData,
      };
      navigate("/checkout", { state: { checkoutData } });
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setExistingAddress(null);
        setIsModalOpen(true);
      } else {
        console.error("Gagal memeriksa alamat:", err);
        alert("Gagal melanjutkan ke checkout. Silakan coba lagi.");
      }
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  // fungsi untuk menangani checkout
  const handleSaveAddressAndCheckout = (addressData) => {
    console.log("Alamat disimpan:", addressData);

    const checkoutData = {
      items: cartItems,
      subtotal: subtotal,
      shippingCost: shippingCost,
      grandTotal: grandTotal,
      shippingAddress: addressData,
    };

    navigate("/checkout", { state: { checkoutData } });
  };

  const renderCartContent = () => {
    if (loading)
      return <p className="text-center font-semibold">Memuat Keranjang...</p>;
    if (error)
      return <p className="text-center text-red-500 font-semibold">{error}</p>;
    if (cartItems.length === 0) {
      return (
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold mb-2">Keranjang Anda Kosong</h2>
        </div>
      );
    }
    return cartItems.map((item) => {
      const product = item.product;
      if (!product) return null;
      const imageUrl = product.image
        ? `${import.meta.env.VITE_API_BASE_URL}/${product.image.replace(
            /\\/g,
            "/"
          )}`
        : "https://placehold.co/400x300/e2e8f0/333?text=No+Image";

      return (
        <div
          key={item.cartItemId}
          className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center border-b pb-4"
        >
          <div className="col-span-1 md:col-span-3 flex items-center gap-4">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-md"
            />
            <div>
              <p className="font-semibold">{product.name}</p>
              <p className="text-sm text-gray-500">Ukuran: {item.size}</p>
            </div>
          </div>
          <div className="text-center">{formatRupiah(item.price)}</div>
          <div className="flex justify-center items-center">
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => handleQuantityChange(item, -1)}
                className="px-3 py-1 font-bold"
              >
                -
              </button>
              <input
                type="text"
                value={item.quantity}
                readOnly
                className="w-12 text-center border-l border-r"
              />
              <button
                onClick={() => handleQuantityChange(item, 1)}
                className="px-3 py-1 font-bold"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center md:justify-end">
            <div className="text-right font-semibold">
              {formatRupiah(item.price * item.quantity)}
            </div>

            <button
              onClick={() => handleRemoveItem(item)}
              className="ml-4 text-red-500 hover:text-red-700"
            >
              <svg
                xmlns="http://www.w.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.033C6.913 3.75 6 4.704 6 5.884v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
          </div>
        </div>
      );
    });
  };
  return (
    <>
      {/*herosection*/}
      <div
        className="relative w-full h-[50vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${heroimage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="flex items-end justify-start h-full p-10">
          <h1 className="text-white text-4xl font-bold">Keranjang Belanja</h1>
        </div>
      </div>

      <div className="bg-gray-50">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-4">
            {" "}
            <DynamicBreadcrumb />{" "}
            <div className="block mb-4">
              <Link
                to="/history"
                className="text-sm font-semibold text-gray-700 border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                Riwayat Pesanan
              </Link>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            {renderCartContent()}
          </div>
          {/* Tampilan Summary Section jika ada item di keranjang */}
          {cartItems.length > 0 && (
            <div className="w-full md:w-1/2 lg:w-1/3 ml-auto mt-6">
              <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span>Subtotal</span>
                  <span>{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Estimasi Ongkir</span>
                  <span>{formatRupiah(shippingCost)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Grand Total</span>
                  <span>{formatRupiah(grandTotal)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-black text-white py-3 mt-4 rounded-lg font-semibold hover:bg-gray-800"
                >
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddressForm
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveAddressAndCheckout}
          existingAddress={existingAddress}
        />
      </Modal>
    </>
  );
}
