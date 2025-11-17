import React, { useState } from "react";
import Modal from "./Modal"; // Asumsi Modal.jsx ada di folder yang sama

export default function SizeSelectionModal({
  isOpen,
  onClose,
  onCheckout,
  product,
}) {
  const [selectedVariant, setSelectedVariant] = useState(null);

  const handleCheckoutClick = () => {
    if (!selectedVariant) {
      alert("Silakan pilih ukuran terlebih dahulu.");
      return;
    }
    // Kirim seluruh objek varian yang dipilih ke parent
    onCheckout(selectedVariant);
  };

  if (!product) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-2">
        <h2 className="text-2xl font-bold mb-2">Ukuran Sepatu</h2>
        <p className="text-gray-600 mb-6">
          Untuk membuat pesanan, silakan tambahkan ukuran dari sepatu yang telah
          dipilih.
        </p>

        <div className="flex flex-wrap gap-3 mb-8">
         
          {(product.variants || []).map((variant) => (
            <button
              key={variant.variantId}
              onClick={() => setSelectedVariant(variant)}
              disabled={variant.stock === 0}
              className={`px-5 py-2 border rounded-lg transition-colors ${
                selectedVariant?.variantId === variant.variantId
                  ? "bg-black text-white border-black"
                  : "bg-gray-200 text-black border-gray-200"
              } ${
                variant.stock === 0
                  ? "opacity-50 cursor-not-allowed line-through"
                  : "hover:bg-gray-300"
              }`}
            >
              {variant.size}
            </button>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleCheckoutClick}
            className="px-8 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800"
          >
            Ok
          </button>
        </div>
      </div>
    </Modal>
  );
}
