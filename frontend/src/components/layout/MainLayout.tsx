import { useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] =
    useState(true);

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
      <Navbar
        onMenuClick={() =>
          setSidebarOpen(!sidebarOpen)
        }
      />

      <Sidebar
        open={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      <main
        className={`
          pt-16
          transition-[padding]
          duration-200
          ${
            sidebarOpen
              ? "lg:pl-60"
              : "lg:pl-0"
          }
        `}
      >
        <div className="px-4 py-6 lg:px-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
