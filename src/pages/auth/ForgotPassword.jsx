import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.jsx"; // Pastikan path ini benar

// Komponen Notifikasi Sederhana (bisa dibuat file terpisah)
function Notification({ message, type }) {
  const baseClasses = "p-3 text-center rounded-lg mb-4";
  const typeClasses =
    type === "error"
      ? "bg-red-100 text-red-700"
      : "bg-green-100 text-green-700";

  if (!message) return null;

  return <div className={`${baseClasses} ${typeClasses}`}>{message}</div>;
}

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  // State untuk UI feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.post("/auth/forgot-password", { email });

      setSuccess(
        response.data.message ||
          "Tautan reset password telah dikirim ke email Anda."
      );

      setTimeout(() => {
        navigate("/confirmcode", { state: { email } });
      }, 2000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Gagal mengirim email. Periksa kembali alamat email Anda.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-gray-950">
      {/* Sisi Kiri */}
      <div className="hidden lg:block lg:w-1/4 xl:w-1/3 bg-gray-950"></div>

      {/* Sisi Kanan (Formulir) */}
      <div className="bg-white w-full lg:w-3/4 xl:w-2/3 min-h-screen lg:rounded-tl-2xl lg:rounded-bl-2xl">
        <div className="flex flex-col justify-center items-start px-6 sm:px-12 lg:px-20 pt-12 lg:pt-20">
          <h1 className="text-black text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4">
            Reset Password
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg mb-6 text-justify">
            Masukkan alamat email yang terkait dengan akun Anda dan kami akan
            mengirimkan tautan untuk memperbarui password Anda.
          </p>
        </div>

        <div className="px-6 sm:px-12 lg:px-20 max-w-md lg:max-w-none mx-auto lg:mx-0">
          <form onSubmit={handleForgotPassword} className="space-y-5">
            {/* Menampilkan notifikasi error atau sukses */}
            <Notification message={error} type="error" />
            <Notification message={success} type="success" />

            {/* Input Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm sm:text-base font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full border-2 border-gray-300 rounded-xl p-3 focus:outline-none focus:border-gray-600 transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contoh@email.com"
                required
              />
            </div>

            {/* Tombol Kirim */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white rounded-xl p-3 font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Mengirim..." : "Kirim Email Reset"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
