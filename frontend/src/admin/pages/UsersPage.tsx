import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  ShieldCheck,
  Users,
  Power,
  UserRound,
} from "lucide-react";

import { userService } from "../services/userService";
import type { UserSummary } from "../services/userService";

export default function UsersPage() {
  const [users, setUsers] = useState<UserSummary[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await userService.getUsers();
      setUsers(response.data.content);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleUser = async (user: UserSummary) => {
    try {
      if (user.enabled) {
        await userService.disableUser(user.id);
      } else {
        await userService.enableUser(user.id);
      }

      loadUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const grantAdmin = async (id: number) => {
    try {
      await userService.grantAdmin(id);
      loadUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const removeAdmin = async (id: number) => {
    try {
      await userService.removeAdmin(id);
      loadUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.enabled
  ).length;

  const disabledUsers = users.filter(
    (user) => !user.enabled
  ).length;

  const adminUsers = users.filter((user) =>
    user.roles.includes("ROLE_ADMIN")
  ).length;

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-[#0a0a0b] dark:text-white">
      <div className="space-y-8">

        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <section
          className="
            rounded-lg
            border
            border-slate-200
            bg-white
            p-6
            dark:border-white/10
            dark:bg-[#111113]
          "
        >
          <p className="mb-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-500">
            User Management
          </p>

          <div className="flex items-center gap-3">
            <Users className="h-7 w-7 text-orange-500" />

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Users
            </h1>
          </div>

          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            Manage platform users, account access and
            administrator privileges across CorvusCode.
          </p>
        </section>

        {/* =====================================================
            USER STATS
        ====================================================== */}

        <section>
          <div className="mb-4">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              User Overview
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-600">
              Current platform account statistics
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* Total Users */}
            <div
              className="
                rounded-lg
                border
                border-slate-200
                bg-white
                p-5
                dark:border-white/10
                dark:bg-[#111113]
              "
            >
              <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Users
              </p>

              <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {totalUsers}
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Registered platform users
              </p>
            </div>

            {/* Active Users */}
            <div
              className="
                rounded-lg
                border
                border-slate-200
                bg-white
                p-5
                dark:border-white/10
                dark:bg-[#111113]
              "
            >
              <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Active Users
              </p>

              <p className="mt-3 text-3xl font-bold tracking-tight text-green-600 dark:text-green-400">
                {activeUsers}
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Currently enabled accounts
              </p>
            </div>

            {/* Disabled Users */}
            <div
              className="
                rounded-lg
                border
                border-slate-200
                bg-white
                p-5
                dark:border-white/10
                dark:bg-[#111113]
              "
            >
              <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Disabled Users
              </p>

              <p className="mt-3 text-3xl font-bold tracking-tight text-red-600 dark:text-red-400">
                {disabledUsers}
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Accounts currently disabled
              </p>
            </div>

            {/* Administrators */}
            <div
              className="
                rounded-lg
                border
                border-slate-200
                bg-white
                p-5
                dark:border-white/10
                dark:bg-[#111113]
              "
            >
              <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Administrators
              </p>

              <p className="mt-3 text-3xl font-bold tracking-tight text-orange-500 dark:text-orange-400">
                {adminUsers}
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Users with admin privileges
              </p>
            </div>

          </div>
        </section>

        {/* =====================================================
            USERS
        ====================================================== */}

        <section>
          <div className="mb-4">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Platform Users
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-600">
              Manage account status and administrator access
            </p>
          </div>

          <div className="space-y-3">

            {users.length === 0 ? (
              <div
                className="
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  p-10
                  text-center
                  dark:border-white/10
                  dark:bg-[#111113]
                "
              >
                <Users
                  size={36}
                  className="mx-auto text-slate-400 dark:text-slate-600"
                />

                <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-200">
                  No Users Found
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  No registered users are available.
                </p>
              </div>
            ) : (
              users.map((user) => {
                const isAdmin = user.roles.includes("ROLE_ADMIN");

                return (
                  <div
                    key={user.id}
                    className="
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      p-5
                      transition
                      hover:border-slate-300
                      dark:border-white/10
                      dark:bg-[#111113]
                      dark:hover:border-white/20
                    "
                  >
                    <div
                      className="
                        flex
                        flex-col
                        gap-5
                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                      "
                    >

                      {/* =================================================
                          USER INFORMATION
                      ================================================== */}

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-2.5">

                          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                            {user.fullName}
                          </h3>

                          {/* Account Status */}
                          <span
                            className={`
                              rounded-full
                              border
                              px-2.5
                              py-1
                              text-[11px]
                              font-medium
                              ${
                                user.enabled
                                  ? `
                                    border-green-500/20
                                    bg-green-500/10
                                    text-green-600
                                    dark:text-green-400
                                  `
                                  : `
                                    border-red-500/20
                                    bg-red-500/10
                                    text-red-600
                                    dark:text-red-400
                                  `
                              }
                            `}
                          >
                            {user.enabled ? "Active" : "Disabled"}
                          </span>

                          {/* Admin Badge */}
                          {isAdmin && (
                            <span
                              className="
                                rounded-full
                                border
                                border-orange-500/20
                                bg-orange-500/10
                                px-2.5
                                py-1
                                text-[11px]
                                font-medium
                                text-orange-600
                                dark:text-orange-400
                              "
                            >
                              Admin
                            </span>
                          )}

                        </div>

                        {/* Email */}
                        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                          {user.email}
                        </p>

                        {/* User Details */}
                        <div
                          className="
                            mt-3
                            flex
                            flex-wrap
                            gap-x-6
                            gap-y-2
                            text-xs
                            text-slate-500
                            dark:text-slate-400
                          "
                        >
                          <span>
                            Country:
                            <span className="ml-1.5 text-slate-700 dark:text-slate-300">
                              {user.country || "-"}
                            </span>
                          </span>

                          <span>
                            Solved:
                            <span className="ml-1.5 font-medium text-slate-700 dark:text-slate-300">
                              {user.totalSolved}
                            </span>
                          </span>
                        </div>

                      </div>

                      {/* =================================================
                          ACTIONS
                      ================================================== */}

                      <div className="flex shrink-0 flex-wrap gap-2">

                        {/* View Profile */}
                        <Link
                          to={`/admin/users/${user.id}/profile`}
                          className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-md
                            border
                            border-slate-300
                            bg-transparent
                            px-3.5
                            py-2
                            text-xs
                            font-medium
                            text-slate-600
                            transition
                            hover:border-orange-500/50
                            hover:text-orange-600
                            dark:border-white/15
                            dark:text-slate-300
                            dark:hover:border-orange-500/50
                            dark:hover:text-orange-400
                          "
                        >
                          <UserRound size={14} />
                          View Profile
                        </Link>

                        {/* Enable / Disable */}
                        <button
                          onClick={() =>
                            handleToggleUser(user)
                          }
                          className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-md
                            border
                            border-orange-500/20
                            bg-orange-500/10
                            px-3.5
                            py-2
                            text-xs
                            font-medium
                            text-orange-600
                            transition
                            hover:border-orange-500/30
                            hover:bg-orange-500/20
                            dark:text-orange-400
                          "
                        >
                          <Power size={14} />

                          {user.enabled
                            ? "Disable"
                            : "Enable"}
                        </button>

                        {/* Admin Role */}
                        {!isAdmin ? (
                          <button
                            onClick={() =>
                              grantAdmin(user.id)
                            }
                            className="
                              inline-flex
                              items-center
                              gap-2
                              rounded-md
                              border
                              border-blue-500/20
                              bg-blue-500/10
                              px-3.5
                              py-2
                              text-xs
                              font-medium
                              text-blue-600
                              transition
                              hover:border-blue-500/30
                              hover:bg-blue-500/20
                              dark:text-blue-400
                            "
                          >
                            <ShieldCheck size={14} />
                            Make Admin
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              removeAdmin(user.id)
                            }
                            className="
                              inline-flex
                              items-center
                              gap-2
                              rounded-md
                              border
                              border-red-500/20
                              bg-red-500/10
                              px-3.5
                              py-2
                              text-xs
                              font-medium
                              text-red-600
                              transition
                              hover:border-red-500/30
                              hover:bg-red-500/20
                              dark:text-red-400
                            "
                          >
                            <Shield size={14} />
                            Remove Admin
                          </button>
                        )}

                      </div>
                    </div>
                  </div>
                );
              })
            )}

          </div>
        </section>

      </div>
    </div>
  );
}