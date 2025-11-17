import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../../api/axios.jsx";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/login", formData);

      if (response.data.accessToken && response.data.user) {
        // Panggil fungsi 'login' dari context
        login(
          response.data.accessToken,
          response.data.refreshToken,
          response.data.user
        );

        // Arahkan pengguna berdasarkan role
        if (response.data.user.role === "admin") {
          navigate("/admin/productlist");
        } else {
          navigate("/homepage");
        }
      } else {
        setError("Respons dari server tidak valid.");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Email atau password salah.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-950 flex justify-center items-center md:justify-start md:flex-row-reverse w-full min-h-screen">
      <div className="bg-white w-11/12 md:w-3/4 md:h-screen rounded-2xl md:rounded-tl-2xl md:rounded-bl-2xl md:rounded-tr-none md:rounded-br-none m-2 mr-0">
        <div className="pt-10 px-6 md:pt-16 md:px-20">
          <h1 className="text-2xl md:text-3xl text-black font-medium text-center md:text-left">
            Login ke Akun Anda
          </h1>
        </div>

        <div className="p-6 md:px-20">
          <form onSubmit={handleLogin} className="mt-6 space-y-5">
            {error && (
              <div className="p-3 text-center bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Grup Email */}
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
                autoComplete="email"
                placeholder="Masukkan email"
                value={formData.email}
                onChange={handleChange}
                className="border-slate-200 md:w-3/4 w-5/6 border-2 rounded-2xl p-2 focus:outline-none focus:border-gray-500"
                required
              />
            </div>

            {/* Grup Password */}
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
                  className="border-slate-200 w-full border-2 rounded-2xl p-2 pr-10 focus:outline-none focus:border-gray-500"
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

            {/* Checkbox "Ingat Saya" & Link "Lupa Password" */}
            <div className="flex items-center justify-between md:w-3/4 w-5/6 mx-auto md:mx-0">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-black focus:ring-gray-700"
                />
                <label htmlFor="remember-me" className="text-sm">
                  Ingat saya
                </label>
              </div>
              <Link
                to="/forgotpassword"
                className="font-semibold text-sm text-black hover:underline"
              >
                Lupa Password?
              </Link>
            </div>

            {/* Tombol Submit */}
            <div className="pt-4 flex justify-center md:justify-start">
              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white md:w-3/4 w-5/6 rounded-2xl p-2.5 font-semibold cursor-pointer hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                {loading ? "Memproses..." : "Login"}
              </button>
            </div>
          </form>

          <p className="pr-10 text-sm text-center md:text-start mt-4">
            Tidak punya akun?{" "}
            <Link
              to="/register"
              className="font-semibold text-black hover:underline"
            >
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
