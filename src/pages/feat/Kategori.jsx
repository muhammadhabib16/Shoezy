import React, { useState, useEffect } from "react";
import heroimage from "../../assets/img/heroimage.jpg";
import FilterSidebar from "../../components/FilterSidebar";
import SortingBar from "../../components/SortingBar";
import Card from "../../components/CardShoes";
import Pagination from "../../components/Pagination";
import { useAuth } from "../../context/AuthContext";
import DynamicBreadcrumb from "../../components/DynamicBreadcrumb";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../api/axios";

export default function Kategori() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  // State untuk metadata pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const [availableCategories, setAvailableCategories] = useState([]);

  const [filters, setFilters] = useState({
    categories: [],
    rating: null,
    price: { min: 0, max: 10000000 },
    sortBy: "createdAt",
    order: "DESC",
  });

  const [searchParams] = useSearchParams();
  const searchTermFromURL = searchParams.get("search");

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/types");

        setAvailableCategories(response.data);
      } catch (err) {
        console.error("Gagal mengambil data kategori:", err);

        setAvailableCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (searchTermFromURL) {
        params.append("search", searchTermFromURL);
      }

      if (filters.categories.length > 0) {
        filters.categories.forEach((cat) => params.append("typeName", cat));
      }
      if (filters.rating) {
        params.append("rating", filters.rating);
      }
      params.append("minPrice", filters.price.min);
      params.append("maxPrice", filters.price.max);

      params.append("page", currentPage);
      params.append("sortBy", filters.sortBy);
      params.append("order", filters.order);

      try {
        const response = await api.get(`/products?${params.toString()}`);

        setProducts(response.data.products);
        setPagination({
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalItems: response.data.totalItems,
        });
      } catch (err) {
        console.error("Gagal mengambil data produk:", err);
        setError("Gagal memuat produk. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, searchTermFromURL, currentPage]);

  const handleFilterChange = (newFilters) => {
    setCurrentPage(1);
    setFilters(newFilters);
  };

  const handleSortChange = (sortBy, order) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      sortBy: sortBy,
      order: order,
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll ke atas halaman
  };

  const renderProductContent = () => {
    if (loading)
      return <div className="text-center col-span-full py-10">Loading...</div>;
    if (error)
      return (
        <div className="text-center col-span-full py-10 text-red-500">
          {error}
        </div>
      );
    if (products.length === 0)
      return (
        <div className="text-center col-span-full py-10">
          Tidak ada produk yang cocok.
        </div>
      );

    return products.map((product) => (
      // Panggil Card dengan prop 'product' agar semua data terkirim
      <Card
        key={product.id}
        product={product}
        isWishlisted={product.isWishlisted}
        onWishlistToggle={() =>
          handleWishlistToggle(product.id, product.isWishlisted)
        }
      />
    ));
  };

  return (
    <>
      <div className="bg-gray-100 w-full min-h-screen flex flex-col">
        <div className="container mx-auto flex flex-col md:flex-row px-6">
          {/* Kolom Kiri - Wrapper untuk Sidebar */}
          <div className="w-full md:w-1/4 lg:w-1/5 py-6">
            <div className="sticky top-6">
              <FilterSidebar
                categories={availableCategories}
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Kolom Kanan - Hasil Pencarian */}
          <div className="w-full md:w-3/4 lg:w-4/5 py-4 md:px-10 md:py-6">
            <div className="hidden md:block my-2">
              <DynamicBreadcrumb />
            </div>
            <div className="mb-6">
              <SortingBar
                onSortChange={handleSortChange}
                currentSort={{ sortBy: filters.sortBy, order: filters.order }}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderProductContent()}
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center py-12">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
}
