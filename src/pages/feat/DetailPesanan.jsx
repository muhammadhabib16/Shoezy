import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";

// Komponen untuk setiap langkah di timeline
const TrackingStep = ({ stepName, stepNumber, currentStepIndex, isLast }) => {
  const isActive = stepNumber <= currentStepIndex;
  return (
    <div className="flex-1 flex items-center">
      <div className="flex flex-col items-center text-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
            isActive ? "bg-black text-white" : "bg-gray-200 text-gray-500"
          }`}
        >
          {stepNumber + 1}
        </div>
        <p
          className={`mt-2 text-xs w-20 ${
            isActive ? "font-semibold" : "text-gray-500"
          }`}
        >
          {stepName}
        </p>
      </div>
      {!isLast && (
        <div
          className={`flex-1 h-1 transition-colors duration-300 mx-2 ${
            isActive && currentStepIndex > stepNumber
              ? "bg-black"
              : "bg-gray-200"
          }`}
        ></div>
      )}
    </div>
  );
};

// Komponen Timeline Tracking
const TrackingTimeline = ({ status }) => {
  const steps = ["Pending", "Paid", "Packed", "Shipped", "Delivered"];
  const currentStepIndex = steps.indexOf(status);

  if (currentStepIndex < 0)
    return (
      <p className="text-sm text-gray-500">Status pesanan tidak diketahui.</p>
    );

  return (
    <div className="flex items-start w-full">
      {steps.map((step, index) => (
        <TrackingStep
          key={step}
          stepName={step}
          stepNumber={index}
          currentStepIndex={currentStepIndex}
          isLast={index === steps.length - 1}
        />
      ))}
    </div>
  );
};

export default function DetailPesanan() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/orders/${orderId}`);
        setOrder(response.data);
      } catch (err) {
        console.error("Gagal mengambil detail pesanan:", err);
        setError("Gagal memuat detail pesanan.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleCancelOrder = async () => {
    try {
      await api.put(`/orders/${order.id}/cancel`);
      alert(`Pesanan #${order.id} berhasil dibatalkan.`);
      const response = await api.get(`/orders/${orderId}`);
      setOrder(response.data);
    } catch (err) {
      alert("Gagal membatalkan pesanan.");
    }
  };

  if (loading)
    return <div className="text-center py-20">Memuat detail pesanan...</div>;
  if (error)
    return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!order)
    return <div className="text-center py-20">Pesanan tidak ditemukan.</div>;

  const productSummary = order.items
    .map(
      (item) => `${item.variantDetails.product.name} (Qty: ${item.quantity})`
    )
    .join(", ");

  const recipientName = order.shipping_address.split("\n")[0];
  const addressDetails = order.shipping_address.split("\n").slice(1).join("\n");

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Manajemen Pemesanan</h1>
        <p className="text-gray-500 mb-6">Detail Pemesanan #{order.id}</p>

        <div className="space-y-6">
          {/* Card Detail Pemesanan */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="space-y-3 text-sm">
              <div className="flex flex-col sm:flex-row">
                <span className="w-full sm:w-1/3 text-gray-500">
                  Nama Penerima
                </span>
                <span className="font-medium">{recipientName}</span>
              </div>
              <div className="flex flex-col sm:flex-row">
                <span className="w-full sm:w-1/3 text-gray-500">Produk</span>
                <span className="font-medium">{productSummary}</span>
              </div>
              <div className="flex flex-col sm:flex-row">
                <span className="w-full sm:w-1/3 text-gray-500">Alamat</span>
                <span className="font-medium whitespace-pre-line">
                  {addressDetails}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row">
                <span className="w-full sm:w-1/3 text-gray-500">Ekspedisi</span>
                <span className="font-medium">{order.shipping_method}</span>
              </div>
              <div className="flex flex-col sm:flex-row">
                <span className="w-full sm:w-1/3 text-gray-500">
                  Pembayaran
                </span>
                <span className="font-medium">{order.payment_method}</span>
              </div>
            </div>
          </div>

          {/* Card Tracking */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Tracking</h2>
            <TrackingTimeline status={order.status} />
          </div>

          {order.status === "Pending" && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleCancelOrder}
                className="border-2 border-red-500 text-red-500 px-8 py-2 rounded-full font-semibold hover:bg-red-500 hover:text-white transition-colors"
              >
                Batalkan Pesanan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
