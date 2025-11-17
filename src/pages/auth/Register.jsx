import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios.jsx";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok!");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", formData);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Full error response:", err.response);
      const errorMessage =
        err.response?.data?.message || "Registrasi gagal. Silakan coba lagi.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-950 flex justify-center items-center md:justify-start md:flex-row-reverse w-full min-h-screen">
      <div className="bg-white w-11/12 md:w-3/4 md:h-screen rounded-2xl md:rounded-tl-2xl md:rounded-bl-2xl md:rounded-tr-none md:rounded-br-none  mr-0">
        <div className="pt-10 px-6 md:pt-16 md:px-20">
          <h1 className="text-2xl md:text-3xl text-black font-medium text-center md:text-left">
            Buat Akun Saya
          </h1>
        </div>

        <div className="p-6 md:px-20">
          <form onSubmit={handleRegister} className="mt-6 space-y-5">
            {error && (
              <div className="p-3 text-center bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 text-center bg-green-100 text-green-700 rounded-lg">
                Registrasi berhasil! Mengarahkan ke halaman login...
              </div>
            )}

            <div className="flex flex-col items-center md:items-start">
              <label
                htmlFor="fullName"
                className="mb-1 self-stretch text-center md:text-left"
              >
                Nama Lengkap
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Masukkan nama"
                value={formData.fullName}
                onChange={handleChange}
                className="border-slate-200 md:w-3/4 w-5/6 border-2 rounded-2xl p-2"
                required
              />
            </div>

            <div className="flex flex-col items-center md:items-start">
              <label
                htmlFor="email"
                className="mb-1 self-stretch text-center md:text-left"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Masukkan email"
                value={formData.email}
                onChange={handleChange}
                className="border-slate-200 md:w-3/4 w-5/6 border-2 rounded-2xl p-2"
                required
              />
            </div>

            <div className="flex flex-col items-center md:items-start">
              <label
                htmlFor="password"
                className="mb-1 self-stretch text-center md:text-left"
              >
                Password
              </label>
              <div className="relative w-5/6 md:w-3/4">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={formData.password}
                  onChange={handleChange}
                  className="border-slate-200 w-full border-2 rounded-2xl p-2 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <label
                htmlFor="confirm-password"
                className="mb-1 self-stretch text-center md:text-left"
              >
                Konfirmasi Password
              </label>
              <div className="relative w-5/6 md:w-3/4">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Masukkan konfirmasi password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="border-slate-200 w-full border-2 rounded-2xl p-2 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start pt-2">
              <input id="terms" type="checkbox" className="mr-2" required />
              <label htmlFor="terms" className="text-sm">
                Saya setuju dengan{" "}
                <a
                  href="#"
                  className="font-semibold text-black hover:underline"
                >
                  syarat dan ketentuan
                </a>
              </label>
            </div>

            <div className="pt-4 flex justify-center md:justify-start">
              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white md:w-3/4 w-5/6 rounded-2xl p-2.5 font-semibold cursor-pointer hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                {loading ? "Memproses..." : "Daftar"}
              </button>
            </div>
            <p className="pr-10 text-sm text-center md:text-start mt-4">
              Sudah Punya Akun ?{" "}
              <Link
                to="/login"
                className="font-semibold text-black hover:underline"
              >
                Login Disini
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
