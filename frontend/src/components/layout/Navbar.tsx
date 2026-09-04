import {
  Menu,
  Bell,
  Moon,
  Sun,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getUser } from "@/services/token";
import { useTheme } from "@/context/ThemeContext";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({
  onMenuClick,
}: NavbarProps) {
  const user = getUser();

  const { theme, toggleTheme } = useTheme();

  const firstName =
    user?.fullName?.split(" ")[0] || "User";

  const avatarLetter =
    user?.fullName?.charAt(0).toUpperCase() || "U";

  return (
    <header
      className="
        fixed
        top-0
        left-0
        right-0
        z-50
        h-16
        border-b
        border-slate-200
        bg-white/90
        backdrop-blur
        dark:border-white/10
        dark:bg-[#0a0a0b]/90
      "
    >
      <div className="flex h-full items-center justify-between px-4">

        {/* Left side */}
        <div className="flex items-center gap-3">

          <button
            onClick={onMenuClick}
            className="
              rounded-md
              p-2
              text-slate-500
              transition-colors
              hover:bg-slate-100
              hover:text-slate-900
              dark:text-slate-400
              dark:hover:bg-white/5
              dark:hover:text-white
            "
            aria-label="Toggle sidebar"
          >
            <Menu size={18} />
          </button>

          <div className="flex items-center gap-2.5">

            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-500 font-mono text-sm font-bold text-white">
              &gt;_
            </span>

            <span className="font-[var(--font-display)] text-[15px] font-bold tracking-tight text-slate-900 dark:text-white">
              Corvus<span className="text-orange-500">Code</span>
            </span>

          </div>

        </div>

        {/* Right side */}
        <div className="flex items-center gap-1">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="
              rounded-md
              p-2
              text-slate-500
              transition-colors
              hover:bg-slate-100
              hover:text-slate-900
              dark:text-slate-400
              dark:hover:bg-white/5
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
                : "Night mode"
            }
          >
            {theme === "dark" ? (
              <Sun size={17} />
            ) : (
              <Moon size={17} />
            )}
          </button>

          {/* Notifications */}
          <button
            className="
              relative
              rounded-md
              p-2
              text-slate-500
              transition-colors
              hover:bg-slate-100
              hover:text-slate-900
              dark:text-slate-400
              dark:hover:bg-white/5
              dark:hover:text-white
            "
            aria-label="Notifications"
          >
            <Bell size={17} />

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

          {/* User */}
          <Link
            to="/profile"
            className="
              ml-2
              flex
              items-center
              gap-2.5
              border-l
              border-slate-200
              pl-3
              transition-colors
              duration-150
              hover:opacity-80
              dark:border-white/10
            "
          >

            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-md
                bg-orange-500/10
                font-mono
                text-xs
                font-bold
                text-orange-600
                dark:text-orange-400
              "
            >
              {avatarLetter}
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-medium leading-tight text-slate-900 dark:text-white">
                {firstName}
              </p>

              <p className="font-mono text-[10px] leading-tight text-slate-500">
                student
              </p>
            </div>

          </Link>

        </div>

      </div>
    </header>
  );
}
