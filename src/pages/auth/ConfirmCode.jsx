import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axios.jsx";

export default function ConfirmCode() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userEmail = location.state?.email;
    if (userEmail) {
      setEmail(userEmail);
    } else {
      // Arahkan ke awal alur jika tidak ada email
      navigate("/forgotpassword");
    }
  }, [location, navigate]);

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // PERBAIKAN 1: Kirim 'code' dari state, bukan 'token'
      const response = await api.post("/auth/verify-code", { email, code });

      // PERBAIKAN 2: Ambil token dari 'resetAuthToken' sesuai format API
      const resetToken = response.data.resetAuthToken;

      // PERBAIKAN 3: Kirim 'resetToken' yang sudah didapat
      navigate("/resetpassword", { state: { email, token: resetToken } });
    } catch (err) {
      console.error("Full error response:", err.response);
      const errorMessage =
        err.response?.data?.message ||
        "Kode verifikasi salah atau telah kedaluwarsa.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... JSX Anda (tidak perlu diubah) ...
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-gray-950">
      <div className="hidden lg:block lg:w-1/4 xl:w-1/3 bg-gray-950"></div>
      <div className="bg-white w-full lg:w-3/4 xl:w-2/3 min-h-screen lg:rounded-tl-2xl lg:rounded-bl-2xl">
        <div className="flex flex-col justify-center items-start px-4 sm:px-6 lg:px-20 pt-8 lg:pt-20">
          <h1 className="text-black text-xl sm:text-2xl lg:text-3xl font-semibold mb-4">
            Verifikasi Kode
          </h1>
          <p className="text-black text-sm sm:text-base lg:text-lg mb-5 pb-5 text-justify">
            Masukkan kode verifikasi yang telah kami kirimkan ke email{" "}
            <strong>{email}</strong>
          </p>
        </div>
        <div className="px-6 sm:px-12 lg:px-20 max-w-md lg:max-w-none mx-auto lg:mx-0">
          <form onSubmit={handleVerifyCode} className="space-y-4">
            {error && (
              <div className="p-3 text-center bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                Kode Verifikasi
              </label>
              <input
                type="text"
                className="w-full border-2 border-gray-300 rounded-xl sm:rounded-2xl p-3 focus:outline-none focus:border-gray-500 transition-colors"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white rounded-xl sm:rounded-2xl p-3 mt-6 hover:bg-gray-800 transition-colors font-medium disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {loading ? "Memverifikasi..." : "Verifikasi Kode"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
