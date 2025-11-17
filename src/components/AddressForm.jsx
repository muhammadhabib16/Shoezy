import React, { useState, useEffect } from "react";
import api from "../api/axios";

export default function AddressForm({ onClose, onSave, existingAddress }) {
  // State untuk menampung data form, loading, dan error
  const [formData, setFormData] = useState({
    recipientName: "",
    phoneNumber: "",
    province: "",
    city: "",
    district: "",
    village: "",
    streetAddress: "",
    details: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (existingAddress) {
      // PERBAIKAN 1: Pastikan semua data, termasuk 'id', disalin ke form
      setFormData(existingAddress);
    }
  }, [existingAddress]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (existingAddress) {
        await api.put("/addresses", formData);
      } else {
        await api.put("/addresses", formData);
      }

      // PERBAIKAN 2: Kirim 'formData' kembali ke parent, bukan 'response.data'
      // 'formData' adalah "sumber kebenaran" yang berisi data lengkap
      onSave(formData);
      onClose();
    } catch (err) {
      console.error("Gagal menyimpan alamat:", err);
      setError(
        err.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-2">Alamat Pengiriman</h2>
      <p className="text-gray-600 mb-6">
        {existingAddress
          ? "Perbarui alamat pengiriman Anda."
          : "Untuk membuat pesanan, silakan tambahkan alamat pengiriman."}
      </p>

      {error && (
        <div className="p-3 mb-4 text-center text-sm bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          name="recipientName"
          placeholder="Nama Lengkap Penerima"
          value={formData.recipientName}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          required
        />
        <input
          type="tel"
          name="phoneNumber"
          placeholder="Nomor Telepon"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          required
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          name="province"
          placeholder="Provinsi"
          value={formData.province}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          required
        />
        <input
          type="text"
          name="city"
          placeholder="Kota"
          value={formData.city}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          required
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          name="district"
          placeholder="Kecamatan"
          value={formData.district}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          required
        />
        <input
          type="text"
          name="village"
          placeholder="Kelurahan"
          value={formData.village}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          required
        />
      </div>
      <textarea
        name="streetAddress"
        placeholder="Nama Jalan, No Rumah"
        rows="3"
        value={formData.streetAddress}
        onChange={handleChange}
        className="w-full border rounded-lg p-3 mb-4"
        required
      ></textarea>
      <input
        type="text"
        name="details"
        placeholder="Detail lainnya (Cth: Blok, unit, patokan)"
        value={formData.details}
        onChange={handleChange}
        className="w-full border rounded-lg p-3 mb-6"
      />

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 border rounded-full font-semibold hover:bg-gray-100"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-2 bg-black text-white rounded-full font-semibold hover:bg-gray-800 disabled:bg-gray-400"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}
