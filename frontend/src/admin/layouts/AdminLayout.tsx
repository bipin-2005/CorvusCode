import { Outlet } from "react-router-dom";

import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminLayout() {
  return (
    <div
      className="
        min-h-screen
        bg-white
        text-slate-900
        transition-colors
        duration-200
        dark:bg-[#0a0a0b]
        dark:text-white
      "
    >
      {/* =====================================================
          ADMIN SIDEBAR
      ====================================================== */}

      <AdminSidebar />

      {/* =====================================================
          ADMIN NAVBAR
      ====================================================== */}

      <AdminNavbar />

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="min-h-screen pl-64 pt-14">
        <div
          className="
            mx-auto
            w-full
            max-w-[1600px]
            px-6
            py-6
            lg:px-8
          "
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}