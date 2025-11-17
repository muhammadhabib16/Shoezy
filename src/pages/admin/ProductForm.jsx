import { Link } from "react-router-dom";
import {
  Search,
  Home,
  BarChart3,
  Package,
  PieChart,
  Users,
  PieChartIcon,
  Heart,
  ShoppingCart,
  User,
} from "lucide-react";
import { Routes, Route } from 'react-router-dom';

function ProductForm() {
  return (
    <div className="flex">
      <nav className="p-5 space-y-4 text-white w-[20.8333%] bg-[#090C47] h-screen">
        <div className="flex flex-row mt-3 items-center gap-3 mb-8">
          <img
            className="w-10 h-10 rounded-full object-cover"
            src="d"
            alt="FotoAdmin"
          />
          <div className="leading-tight">
            <p className="font-semibold text-sm">Nama Admin</p>
            <p className="text-xs text-gray-300">Admin Shoezy</p>
          </div>
        </div>

        <div className="relative w-full  text-black rounded-xl pr-4 mb-8">
          {/* Ikon */}
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className=" w-5 h-5 " />
          </div>

          {/* Input */}
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-15 pr-4 py-4 border  bg-white placeholder-gray-400 rounded-2xl focus:outline-none"
          />
        </div>
        <div className="space-y-4 font-semibold">
          <div className="pl-5 py-5 flex items-center  space-x-2 hover:bg-black p-2 rounded">
            <Home />
            <Link to="/productform">Dashboard</Link>
          </div>
          <div className="flex pl-5 py-5 items-center  space-x-2 hover:bg-black p-2 rounded">
            <BarChart3 />
            <Link to="/produklist">Produk Management</Link>
            
          </div>
          <div className="flex pl-5 py-5 items-center  space-x-2 hover:bg-black p-2 rounded">
            <Package />
            <Link>Order Management</Link>
          </div>
          <div className="flex pl-5 py-5 items-center  space-x-2 hover:bg-black p-2 rounded">
            <PieChartIcon />
            <Link>Analytics</Link>
          </div>
          <div className="flex pl-5 py-5 items-center  space-x-2 hover:bg-black p-2 rounded">
            <Users />
            <Link>Users Management</Link>
          </div>
        </div>
      </nav>
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <div className="bg-black text-white h-16 flex items-center justify-end px-6 space-x-6">
          <Heart className="w-5 h-5 cursor-pointer" />
          <ShoppingCart className="w-5 h-5 cursor-pointer" />
          <User className="w-5 h-5 cursor-pointer" />
        </div>

        {/* Divider */}
        <div className="h-[2px] bg-white" />

        {/* Page Content */}
        <div className="p-6">
          <h1 className="text-xl font-bold">Konten Admin</h1>
        </div>
      </div>
    </div>
  );
}

export default ProductForm;
