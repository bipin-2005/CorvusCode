import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Code2,
  Trophy,
  FileCode,
  Medal,
  UserCircle,
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({
  open,
  onClose,
}: SidebarProps) {
  const links = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={17} strokeWidth={1.8} />,
    },
    {
      to: "/problems",
      label: "Problems",
      icon: <Code2 size={17} strokeWidth={1.8} />,
    },
    {
      to: "/contests",
      label: "Contests",
      icon: <Trophy size={17} strokeWidth={1.8} />,
    },
    {
      to: "/leaderboard",
      label: "Leaderboard",
      icon: <Medal size={17} strokeWidth={1.8} />,
    },
    {
      to: "/submissions",
      label: "Submissions",
      icon: <FileCode size={17} strokeWidth={1.8} />,
    },
    {
      to: "/profile",
      label: "Profile",
      icon: <UserCircle size={17} strokeWidth={1.8} />,
    },
  ];

  return (
    <>
      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}

      {open && (
        <div
          className="
            fixed
            inset-0
            z-30
            bg-black/40
            backdrop-blur-[1px]
            lg:hidden
          "
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`
          fixed
          bottom-0
          left-0
          top-14
          z-40
          w-60
          border-r
          border-slate-200
          bg-white
          transition-transform
          duration-200
          dark:border-white/10
          dark:bg-[#111113]
          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <div className="flex h-full flex-col px-3 py-4">

          {/* =================================================
              NAVIGATION
          ================================================== */}

          <div>
            <p
              className="
                mb-2
                px-3
                font-mono
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.15em]
                text-slate-400
                dark:text-slate-500
              "
            >
              Navigation
            </p>

            <nav className="space-y-1">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                  className={({ isActive }) =>
                    `
                      group
                      flex
                      items-center
                      gap-3
                      rounded-md
                      border-l-2
                      px-3
                      py-2.5
                      text-sm
                      font-medium
                      transition-colors
                      duration-150
                      ${
                        isActive
                          ? `
                            border-orange-500
                            bg-orange-500/[0.08]
                            text-orange-600
                            dark:text-orange-400
                          `
                          : `
                            border-transparent
                            text-slate-600
                            hover:bg-slate-100
                            hover:text-slate-900
                            dark:text-slate-400
                            dark:hover:bg-white/[0.05]
                            dark:hover:text-white
                          `
                      }
                    `
                  }
                >
                  <span className="shrink-0">
                    {link.icon}
                  </span>

                  <span>{link.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          {/* =================================================
              BOTTOM CARD
          ================================================== */}

          <div
            className="
              mt-auto
              border-t
              border-slate-200
              pt-4
              dark:border-white/10
            "
          >
            <div
              className="
                rounded-lg
                border
                border-orange-500/20
                bg-orange-500/[0.04]
                p-3.5
                dark:bg-orange-500/[0.03]
              "
            >
              <p
                className="
                  font-mono
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-wider
                  text-orange-600
                  dark:text-orange-400
                "
              >
                // keep solving
              </p>

              <p
                className="
                  mt-1.5
                  text-xs
                  leading-5
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Consistency is the key to becoming
                a better problem solver.
              </p>

              {/* Progress */}
              <div
                className="
                  mt-3
                  h-1.5
                  overflow-hidden
                  rounded-full
                  bg-slate-200
                  dark:bg-white/10
                "
              >
                <div
                  className="
                    h-full
                    w-[58%]
                    rounded-full
                    bg-orange-500
                  "
                />
              </div>

              <p
                className="
                  mt-1.5
                  font-mono
                  text-[10px]
                  text-slate-500
                "
              >
                58% — weekly goal
              </p>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
}