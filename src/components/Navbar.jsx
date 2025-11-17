import { Link } from "react-router-dom";
import SearchField from "./SearchField";
import MenuIcons from "./menuicons";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center w-full">
      {/* Bagian Kiri: Nama Brand */}
      <div className="hidden md:block">
        <Link to={"/homepage"}>
          <h1 className="text-white text-4xl font-bold">SHOEZY</h1>
        </Link>
      </div>

      {/* Bagian Tengah: SearchField */}
      <SearchField />

      {/* Bagian Kanan: MenuIcons */}
      <MenuIcons />
    </nav>
  );
}
