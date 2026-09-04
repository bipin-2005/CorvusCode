import {
  Bell,
  Moon,
  Sun,
} from "lucide-react";

import { useTheme } from "@/context/ThemeContext";

export default function AdminNavbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className="
        fixed
        left-64
        right-0
        top-0
        z-50
        h-14
        border-b
        border-slate-200
        bg-white
        dark:border-white/10
        dark:bg-[#111113]
      "
    >
      <div className="flex h-full items-center justify-end px-4 sm:px-6">
        <div className="flex items-center gap-1">

          {/* =====================================================
              THEME TOGGLE
          ====================================================== */}

          <button
            type="button"
            onClick={toggleTheme}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-md
              text-slate-500
              transition-colors
              hover:bg-slate-100
              hover:text-slate-900
              dark:text-slate-400
              dark:hover:bg-white/[0.05]
              dark:hover:text-white
            "
            aria-label={
              theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            title={
              theme === "dark"
                ? "Light mode"
                : "Dark mode"
            }
          >
            {theme === "dark" ? (
              <Sun
                size={17}
                strokeWidth={1.8}
              />
            ) : (
              <Moon
                size={17}
                strokeWidth={1.8}
              />
            )}
          </button>

          {/* =====================================================
              NOTIFICATIONS
          ====================================================== */}

          <button
            type="button"
            className="
              relative
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-md
              text-slate-500
              transition-colors
              hover:bg-slate-100
              hover:text-slate-900
              dark:text-slate-400
              dark:hover:bg-white/[0.05]
              dark:hover:text-white
            "
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell
              size={17}
              strokeWidth={1.8}
            />

            {/* Notification Indicator */}
            <span
              className="
                absolute
                right-1.5
                top-1.5
                h-1.5
                w-1.5
                rounded-full
                bg-orange-500
              "
            />
          </button>

          {/* =====================================================
              ADMIN PROFILE
          ====================================================== */}

          <div
            className="
              ml-2
              flex
              items-center
              gap-2.5
              border-l
              border-slate-200
              pl-3
              dark:border-white/10
            "
          >
            {/* Avatar */}
            <div
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-md
                border
                border-orange-500/20
                bg-orange-500/10
                font-mono
                text-xs
                font-bold
                text-orange-600
                dark:text-orange-400
              "
            >
              A
            </div>

            {/* Admin Information */}
            <div className="hidden sm:block">
              <p
                className="
                  text-xs
                  font-semibold
                  leading-tight
                  text-slate-900
                  dark:text-slate-200
                "
              >
                Admin
              </p>

              <p
                className="
                  mt-0.5
                  font-mono
                  text-[10px]
                  leading-tight
                  text-slate-500
                "
              >
                administrator
              </p>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}