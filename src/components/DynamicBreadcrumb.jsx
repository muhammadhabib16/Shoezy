import { useLocation } from "react-router-dom";
import Breadcrumb from "./BreadCrumb";
import { useAuth } from "../context/AuthContext";

export default function DynamicBreadcrumb() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (location.pathname === "/") {
    return null;
  }

  const pathnames = location.pathname.split("/").filter((x) => x);

  let currentLink = "";
  const crumbs = [
    { label: "Home", path: isAuthenticated ? `/homepage` : `/` },
    // Buat crumb untuk setiap segmen path
    ...pathnames.map((name) => {
      currentLink += `/${name}`;

      const formattedName = name
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      return {
        label: formattedName,
        path: currentLink,
      };
    }),
  ];

  return <Breadcrumb crumbs={crumbs} />;
}
