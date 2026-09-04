import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Code2,
  Trophy,
  Settings,
  UserCircle,
} from "lucide-react";

const links = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    label: "Problems",
    path: "/admin/problems",
    icon: Code2,
  },
  {
    label: "Contests",
    path: "/admin/contests",
    icon: Trophy,
  },
  {
    label: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
  {
    label: "My Profile",
    path: "/profile",
    icon: UserCircle,
  },
];

export default function AdminSidebar() {
  return (
    <aside
      className="
        fixed
        left-0
        top-0
        z-50
        h-screen
        w-64
        border-r
        border-slate-200
        bg-white
        transition-colors
        duration-200
        dark:border-white/10
        dark:bg-[#111113]
      "
    >
      <div className="flex h-full flex-col">

        {/* =====================================================
            LOGO
        ====================================================== */}

        <div
          className="
            border-b
            border-slate-200
            px-5
            py-4
            dark:border-white/10
          "
        >
          <div className="flex items-center gap-2.5">

            {/* Logo Mark */}
            <span
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-md
                bg-orange-500
                font-mono
                text-xs
                font-bold
                text-white
              "
            >
              &gt;_
            </span>

            {/* Brand */}
            <h1
              className="
                font-[var(--font-display)]
                text-[15px]
                font-bold
                tracking-tight
                text-slate-900
                dark:text-white
              "
            >
              Corvus
              <span className="text-orange-500">
                Code
              </span>
            </h1>

          </div>

          <p
            className="
              mt-2
              pl-[38px]
              font-mono
              text-[10px]
              uppercase
              tracking-wider
              text-slate-500
              dark:text-slate-500
            "
          >
            Administration Panel
          </p>
        </div>

        {/* =====================================================
            NAVIGATION
        ====================================================== */}

        <div className="flex-1 px-3 py-5">

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
            Management
          </p>

          <nav className="space-y-1">
            {links.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/admin"}
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
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={17}
                        strokeWidth={1.8}
                        className={
                          isActive
                            ? "text-orange-500 dark:text-orange-400"
                            : "text-slate-500 dark:text-slate-500"
                        }
                      />

                      <span>{item.label}</span>

                      {isActive && (
                        <span
                          className="
                            ml-auto
                            h-1.5
                            w-1.5
                            rounded-full
                            bg-orange-500
                          "
                        />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <div
          className="
            border-t
            border-slate-200
            p-3
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
              Admin Access
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
              Manage users, contests and coding
              problems from a centralized workspace.
            </p>
          </div>
        </div>

      </div>
    </aside>
  );
}