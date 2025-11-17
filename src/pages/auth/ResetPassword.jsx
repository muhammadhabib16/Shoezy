import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../../api/axios.jsx";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const token = location.state?.token;

  useEffect(() => {
    if (!email || !token) {
      navigate("/forgotpassword");
    }
  }, [email, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("Password dan konfirmasi password tidak sama");
      setLoading(false);
      return;
    }

    try {
      const dataToSend = {
        password: newPassword,
        confirmPassword: confirmPassword,
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await api.put("/auth/reset-password", dataToSend, config);

      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error("Full error response:", err.response);
      const errorMessage =
        err.response?.data?.message ||
        "Gagal mereset password. Token mungkin tidak valid atau kedaluwarsa.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-gray-950">
      <div className="hidden lg:block lg:w-1/4 xl:w-1/3 bg-gray-950"></div>
      <div className="bg-white w-full lg:w-3/4 xl:w-2/3 min-h-screen lg:rounded-tl-2xl lg:rounded-bl-2xl">
        <div className="flex justify-center lg:justify-start items-center pt-8 lg:pt-20">
          <h2 className="text-black text-2xl sm:text-3xl lg:text-4xl xl:text-4xl mb-6 font-medium lg:pl-20">
            Reset Password
          </h2>
        </div>
        <div className="px-6 sm:px-12 lg:px-20 max-w-md lg:max-w-none mx-auto lg:mx-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-center bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 text-center bg-green-100 text-green-700 rounded-lg">
                Password berhasil diubah! Anda akan diarahkan ke halaman login.
              </div>
            )}
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                Password Baru
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Masukkan password baru"
                  className="w-full border-2 border-gray-300 rounded-2xl p-3 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Masukkan konfirmasi password"
                  className="w-full border-2 border-gray-300 rounded-2xl p-3 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white rounded-2xl p-3 mt-6 font-medium disabled:bg-gray-500"
            >
              {loading ? "Menyimpan..." : "Simpan Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
