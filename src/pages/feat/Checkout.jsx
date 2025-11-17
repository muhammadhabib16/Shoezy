import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import heroimage from "../../assets/img/heroimage.jpg";
import Modal from "../../components/Modal";
import AddressForm from "../../components/AddressForm";

// Helper untuk format Rupiah
const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

// Data Opsi Pengiriman
const shippingOptions = [
  { id: "sicepat", name: "SiCepat", price: 8000 },
  { id: "jne", name: "JNE", price: 10000 },
  { id: "tiki", name: "Tiki", price: 12000 },
];

// Data Opsi Pembayaran
const paymentOptions = {
  transfer: [
    { id: "bca", name: "BCA Transfer" },
    { id: "bni", name: "BNI Transfer" },
    { id: "mandiri", name: "Mandiri Transfer" },
  ],
  ewallet: [
    { id: "gopay", name: "GoPay" },
    { id: "ovo", name: "OVO" },
    { id: "dana", name: "DANA" },
  ],
};

export default function Checkout() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const checkoutDataFromState = location.state?.checkoutData;

  const [cartItems, setCartItems] = useState(
    checkoutDataFromState?.items || []
  );
  const [shippingAddress, setShippingAddress] = useState(
    checkoutDataFromState?.shippingAddress || null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState(
    shippingOptions[0].id
  );
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [paymentType, setPaymentType] = useState("transfer");
  const [selectedPayment, setSelectedPayment] = useState("bca");

  useEffect(() => {
    if (checkoutDataFromState) {
      setCartItems(checkoutDataFromState.items);
      setShippingAddress(checkoutDataFromState.shippingAddress);
    }
  }, [checkoutDataFromState]);

  if (!checkoutDataFromState || cartItems.length === 0) {
    return <Navigate to="/kategori/shopcart" replace />;
  }

  // Kalkulasi dinamis
  const subtotal = checkoutDataFromState.subtotal;
  const shippingCost =
    shippingOptions.find((opt) => opt.id === selectedShipping)?.price || 0;
  const grandTotal = subtotal + shippingCost;

  // Fungsi untuk mengirim pesanan ke API
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress) {
      alert("Silakan tambahkan atau perbarui alamat pengiriman Anda.");
      setIsModalOpen(true);
      return;
    }
    if (!agreedToTerms) {
      alert("Anda harus menyetujui Syarat dan Ketentuan.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const selectedShippingName = shippingOptions.find(
        (opt) => opt.id === selectedShipping
      )?.name;

      let selectedPaymentName = "";
      if (paymentType === "transfer") {
        selectedPaymentName = paymentOptions.transfer.find(
          (opt) => opt.id === selectedPayment
        )?.name;
      } else if (paymentType === "ewallet") {
        selectedPaymentName = paymentOptions.ewallet.find(
          (opt) => opt.id === selectedPayment
        )?.name;
      } else if (paymentType === "cod") {
        selectedPaymentName = "COD";
      }

      const orderPayload = {
        addressId: shippingAddress.id,
        shippingMethod: selectedShippingName,
        shippingCost: shippingCost,
        paymentMethod: selectedPaymentName,
      };

      await api.post("/orders", orderPayload);
      alert("Pesanan berhasil dibuat!");
      navigate("/history");
    } catch (err) {
      console.error("Gagal membuat pesanan:", err);
      setError(
        err.response?.data?.message ||
          "Gagal membuat pesanan. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  const fullAddressString = shippingAddress
    ? `${shippingAddress.streetAddress}, ${shippingAddress.village}, ${shippingAddress.district}, ${shippingAddress.city}, ${shippingAddress.province}`
    : "Alamat belum diatur.";
  return (
    <>
      <div className="bg-gray-50 font-sans">
        {/* hero section */}
        <div
          className="relative w-full h-[40vh] bg-cover bg-center"
          style={{ backgroundImage: `url(${heroimage})` }}
        >
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="relative z-10 flex items-center justify-center h-full">
            <h1 className="text-white text-5xl font-bold">Proses Checkout</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <form
            onSubmit={handlePlaceOrder}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* --- Kolom Kiri: Detail & Opsi --- */}
            <div className="lg:col-span-2 space-y-6">
              {/* Proses Pengiriman */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                  <h2 className="text-lg font-semibold">Alamat Pengiriman</h2>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="text-sm font-semibold text-blue-600 hover:underline"
                  >
                    {shippingAddress ? "Ubah Alamat" : "Tambah Alamat"}
                  </button>
                </div>
                {isAddressLoading ? (
                  <p>Memuat alamat...</p>
                ) : shippingAddress ? (
                  <div className="text-sm">
                    <p className="font-bold">
                      {shippingAddress.recipientName} (
                      {shippingAddress.phoneNumber})
                    </p>
                    <p className="text-gray-600">{fullAddressString}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Alamat pengiriman belum diatur. Silakan tambahkan alamat.
                  </p>
                )}
              </div>

              {/* Produk Dipesan */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Produk Dipesan</h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center border-b pb-4 last:border-b-0 last:pb-0"
                    >
                      <div className="md:col-span-2 flex items-center gap-4">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-grow">
                          <p className="font-semibold text-sm">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Ukuran: {item.size}
                          </p>
                        </div>
                      </div>
                      <div className="text-left md:text-center text-sm">
                        {formatRupiah(item.price)}
                      </div>
                      <div className="flex justify-start md:justify-center items-center">
                        <div className="flex items-center border rounded-lg">
                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(item.cartItemId, -1)
                            }
                            className="px-3 py-1 font-bold"
                          >
                            -
                          </button>
                          <input
                            type="text"
                            value={item.quantity}
                            readOnly
                            className="w-10 text-center border-l border-r"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(item.cartItemId, 1)
                            }
                            className="px-3 py-1 font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center md:justify-end">
                        <span className="md:hidden font-semibold">Total:</span>
                        <span className="font-semibold text-sm text-right">
                          {formatRupiah(item.price * item.quantity)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.cartItemId)}
                          className="ml-4 text-red-500 hover:text-red-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5"
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
                  ))}
                </div>
              </div>

              {/* Opsi Pengiriman */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Opsi Pengiriman</h2>
                <div className="space-y-3">
                  {shippingOptions.map((opt) => (
                    <label
                      key={opt.id}
                      className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name="shipping"
                        value={opt.id}
                        checked={selectedShipping === opt.id}
                        onChange={(e) => setSelectedShipping(e.target.value)}
                        className="h-4 w-4 text-black focus:ring-black"
                      />
                      <span className="ml-3 flex-grow text-sm">{opt.name}</span>
                      <span className="text-sm">{formatRupiah(opt.price)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Metode Pembayaran */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-4">
                  Metode Pembayaran
                </h2>
                <div className="flex flex-wrap gap-6 border-b pb-4 mb-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="paymentType"
                      value="transfer"
                      checked={paymentType === "transfer"}
                      onChange={(e) => setPaymentType(e.target.value)}
                      className="h-4 w-4 text-black focus:ring-black"
                    />
                    <span className="ml-2 text-sm">Transfer Bank</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="paymentType"
                      value="ewallet"
                      checked={paymentType === "ewallet"}
                      onChange={(e) => setPaymentType(e.target.value)}
                      className="h-4 w-4 text-black focus:ring-black"
                    />
                    <span className="ml-2 text-sm">E-Wallet</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="paymentType"
                      value="cod"
                      checked={paymentType === "cod"}
                      onChange={(e) => setPaymentType(e.target.value)}
                      className="h-4 w-4 text-black focus:ring-black"
                    />
                    <span className="ml-2 text-sm">COD (Cash On Delivery)</span>
                  </label>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {paymentType === "transfer" &&
                    paymentOptions.transfer.map((opt) => (
                      <label
                        key={opt.id}
                        className="flex items-center p-2 border rounded-lg cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={opt.id}
                          checked={selectedPayment === opt.id}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                          className="h-4 w-4 text-black focus:ring-black"
                        />
                        <span className="ml-2 text-sm">{opt.name}</span>
                      </label>
                    ))}
                  {paymentType === "ewallet" &&
                    paymentOptions.ewallet.map((opt) => (
                      <label
                        key={opt.id}
                        className="flex items-center p-2 border rounded-lg cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={opt.id}
                          checked={selectedPayment === opt.id}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                          className="h-4 w-4 text-black focus:ring-black"
                        />
                        <span className="ml-2 text-sm">{opt.name}</span>
                      </label>
                    ))}
                </div>
              </div>
            </div>

            {/* --- Kolom Kanan: Ringkasan & Checkout --- */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm sticky top-6">
                <h2 className="text-lg font-semibold mb-4 border-b pb-3">
                  Ringkasan Belanja
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatRupiah(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ongkos Kirim</span>
                    <span>{formatRupiah(shippingCost)}</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-base mt-4 border-t pt-3">
                  <span>Total</span>
                  <span>{formatRupiah(grandTotal)}</span>
                </div>
                <div className="mt-6 border-t pt-4">
                  {error && (
                    <div className="p-3 mb-4 text-center text-sm bg-red-100 text-red-700 rounded-lg">
                      {error}
                    </div>
                  )}
                  <div className="flex items-center mb-4">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                    />
                    <label
                      htmlFor="terms"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Saya setuju dengan{" "}
                      <a
                        href="#"
                        className="font-medium text-black hover:underline"
                      >
                        Syarat & Ketentuan
                      </a>
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-500"
                  >
                    {loading ? "Memproses..." : "Buat Pesanan"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddressForm
          onClose={() => setIsModalOpen(false)}
          onSave={(newAddress) => {
            setShippingAddress(newAddress);
            setIsModalOpen(false);
          }}
          existingAddress={shippingAddress}
        />
      </Modal>
    </>
  );
}
