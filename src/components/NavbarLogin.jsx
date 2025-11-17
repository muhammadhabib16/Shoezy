import React from "react";
import { Link } from "react-router-dom";
import SearchField from "./SearchField"; // Asumsi komponen ini ada

export default function NavbarLogin() {
  return (
    <nav className="flex justify-between items-center w-full">
      {/* Bagian Kiri: Nama Brand */}
      <div className="flex-1">
        <Link to="/">
          <h1 className="text-white text-2xl md:text-4xl font-bold">SHOEZY</h1>
        </Link>
      </div>

      {/* Bagian Tengah: SearchField */}
      <div className="flex-1 flex justify-center px-4">
        <SearchField />
      </div>

      {/* Bagian Kanan: Tombol Login & Daftar */}
      <div className="flex-1 flex justify-end items-center gap-2 md:gap-4">
        <Link
          to="/login"
          className="text-white font-semibold hover:text-gray-300 transition-colors text-sm md:text-base px-3 py-2"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-white text-black font-semibold px-4 py-2 rounded-full hover:bg-gray-200 transition-colors text-sm md:text-base"
        >
          Daftar
        </Link>
      </div>
    </nav>
  );
}
