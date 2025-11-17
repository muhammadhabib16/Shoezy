import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import DynamicBreadcrumb from "../../components/DynamicBreadcrumb";
import heroimage from "../../assets/img/heroimage.jpg";

// Helper untuk format Rupiah
const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

// Helper untuk format Tanggal
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

// Komponen untuk Badge Status
const StatusBadge = ({ status }) => {
  const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-800",
    Paid: "bg-blue-100 text-blue-800",
    Packed: "bg-indigo-100 text-indigo-800",
    Shipped: "bg-purple-100 text-purple-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${
        statusStyles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};

const filterTabs = ["All", "Pending", "Paid", "Packed", "Shipped", "Delivered"];

export default function ShopHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (activeFilter !== "All") {
          params.append("status", activeFilter);
        }

        const response = await api.get(
          `/orders/my-orders?${params.toString()}`
        );
        setOrders(response.data);
      } catch (err) {
        console.error("Gagal mengambil riwayat pesanan:", err);
        setError("Gagal memuat riwayat pesanan.");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [activeFilter]);

  const renderOrderList = () => {
    if (loading) return <p className="text-center py-10">Memuat riwayat...</p>;
    if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
    if (orders.length === 0) {
      return (
        <p className="text-center py-10 text-gray-500">
          Tidak ada pesanan dengan status ini.
        </p>
      );
    }
    return orders.map((order) => (
      <div
        key={order.id}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center border-b py-4"
      >
        <div>
          <p className="font-semibold">Order ID #{order.id}</p>
          <p className="text-sm text-gray-500">
            Tanggal: {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="text-left md:text-center">
          <StatusBadge status={order.status} />
        </div>
        <div className="text-left md:text-center font-semibold">
          Total: {formatRupiah(order.total_price)}
        </div>
        <div className="text-right">
          <Link
            to={`/history/${order.id}`}
            className="text-sm border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-100"
          >
            Detail
          </Link>
        </div>
      </div>
    ));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* herosection */}
      <div
        className="relative w-full h-[50vh] bg-cover bg-center mx-auto"
        style={{ backgroundImage: `url(${heroimage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="flex items-end justify-start h-full p-10">
          <h1 className="text-white text-4xl font-bold">Temukan Gaya Anda</h1>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <DynamicBreadcrumb />
        <h1 className="text-3xl font-bold mb-2">Manajemen Pemesanan</h1>
        <p className="text-gray-500 mb-6">Riwayat Pemesanan</p>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 border-b pb-4 mb-4">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                  activeFilter === tab
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Daftar Pesanan */}
          <div>{renderOrderList()}</div>
        </div>
      </div>
    </div>
  );
}
