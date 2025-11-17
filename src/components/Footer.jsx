import React from "react";
import { Link } from "react-router-dom";

// Helper Ikon Instagram
const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-instagram hover:opacity-75 transition-opacity"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

// Helper Ikon WhatsApp
const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="hover:opacity-75 transition-opacity"
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-1.004zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01s-.521.074-.792.372c-.272.296-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-black text-white w-full">
      {/* Bagian Atas - Konten Utama Footer */}
      <div className="bg-white text-black py-12">
        <div className="container mx-auto flex flex-wrap justify-between items-start gap-8 px-6">
          {/* Kolom 1: Brand */}
          <div className="w-full sm:w-auto">
            <h2 className="text-2xl font-semibold mb-2">SHOEZY</h2>
            <p className="font-medium text-sm">
              Every walk, <br />
              Have Impact.
            </p>
          </div>

          <div className="flex-grow flex justify-start sm:justify-end gap-12 sm:gap-20">
            {/* Kolom 2: Navigasi */}
            <div>
              <h3 className="font-bold mb-4">Navigasi</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <Link to="/" className="hover:text-black">
                    Beranda
                  </Link>
                </li>
                <li>
                  <Link to="/kategori" className="hover:text-black">
                    Produk
                  </Link>
                </li>
                <li>
                  <Link to="/shopcart" className="hover:text-black">
                    Keranjang Belanja
                  </Link>
                </li>
              </ul>
            </div>

            {/* Kolom 3: Sosial Media */}
            <div>
              <h3 className="font-bold mb-4">Sosial Media</h3>
              <p className="text-sm text-gray-700 mb-4">
                Ikuti kami untuk update terbaru.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://wa.me/62..."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon />
                </a>
                <a
                  href="https://instagram.com/..."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InstagramIcon />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian Bawah - Copyright */}
      <div className="container mx-auto py-4 text-center text-sm text-gray-400 px-6">
        <p>© {new Date().getFullYear()} SHOEZY | All Rights Reserved</p>
      </div>
    </footer>
  );
}
