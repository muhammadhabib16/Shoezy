import React from "react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // Fungsi untuk membuat tombol halaman
  const renderPageNumbers = () => {
    const pageNumbers = [];
    // Logika sederhana untuk menampilkan semua halaman
    // Untuk jumlah halaman yang sangat banyak, logika ini bisa dibuat lebih kompleks
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
            currentPage === i
              ? "bg-black text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  if (totalPages <= 1) {
    return null; // Jangan tampilkan pagination jika hanya ada 1 halaman
  }

  return (
    <div className="flex justify-center items-center gap-2">
      {/* Tombol Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 text-sm font-semibold bg-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        Sebelumnya
      </button>

      {/* Tombol Angka Halaman */}
      {renderPageNumbers()}

      {/* Tombol Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 text-sm font-semibold bg-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        Selanjutnya
      </button>
    </div>
  );
}
