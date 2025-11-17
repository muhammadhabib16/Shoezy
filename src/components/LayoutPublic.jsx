import React from "react";
import { Outlet } from "react-router-dom";
import NavbarLogin from "./NavbarLogin";
import DynamicBreadcrumb from "./DynamicBreadcrumb";
import Footer from "./Footer";

export default function LayoutPublic() {
  return (
    <div className="flex bg-black flex-col min-h-screen">
      <div className="mt-4 px-4 bg-black  shadow">
        <NavbarLogin />
      </div>

      <main className="flex-grow">
        {/*konten halaman (Kategori, DetailProduk, dll) dirender */}
        <div className="flex flex-col ">
          <header className="py-2 px-4 hidden md:block"></header>
          <div className="mt-4 md:mt-0">
            <Outlet />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
