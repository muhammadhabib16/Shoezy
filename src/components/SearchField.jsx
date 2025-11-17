import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchField() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/kategori?search=${searchTerm}`);
    }
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="w-full md:w-auto flex justify-center"
    >
      <input
        type="text"
        name="search"
        placeholder="Cari produk..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-9/12 md:w-80 lg:w-150 bg-transparent border-gray-400 rounded-full border p-2 text-white placeholder-gray-300 focus:outline-none focus:border-white transition-all"
      />
    </form>
  );
}
