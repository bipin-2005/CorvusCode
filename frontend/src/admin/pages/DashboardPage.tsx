import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import StatsCard from "../components/StatsCard";
import {
  adminService,
  type DashboardStats,
} from "../services/adminService";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminService.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-red-500 dark:text-red-400">
          Failed to load dashboard.
        </p>
      </div>
    );
  }

  const acceptanceRate =
    stats.totalSubmissions === 0
      ? 0
      : Number(
          (
            (stats.acceptedSubmissions /
              stats.totalSubmissions) *
            100
          ).toFixed(1)
        );

  const verificationRate =
    stats.totalUsers === 0
      ? 0
      : Number(
          (
            (stats.verifiedUsers /
              stats.totalUsers) *
            100
          ).toFixed(0)
        );

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
            Administration
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            Monitor platform growth, user engagement,
            contests, problems and submission activity
            across CorvusCode.
          </p>
        </section>

        {/* =====================================================
            PLATFORM STATS
        ====================================================== */}

        <section>
          <div className="mb-4">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Platform
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-600">
              Core platform metrics
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatsCard
              title="Total Users"
              value={stats.totalUsers}
              detail="registered users"
            />

            <StatsCard
              title="Verified Users"
              value={stats.verifiedUsers}
              detail={`${verificationRate}% verified`}
            />

            <StatsCard
              title="Problems"
              value={stats.totalProblems}
              detail="available problems"
            />

            <StatsCard
              title="Contests"
              value={stats.totalContests}
              detail="all contests"
            />
          </div>
        </section>

        {/* =====================================================
            ACTIVITY STATS
        ====================================================== */}

        <section>
          <div className="mb-4">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Activity
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-600">
              Contest and submission performance
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatsCard
              title="Active Contests"
              value={stats.activeContests}
              detail="currently running"
            />

            <StatsCard
              title="Submissions"
              value={stats.totalSubmissions}
              detail="all attempts"
            />

            <StatsCard
              title="Accepted"
              value={stats.acceptedSubmissions}
              detail="successful submissions"
            />

            <StatsCard
              title="Acceptance Rate"
              value={`${acceptanceRate}%`}
              detail={`${stats.acceptedSubmissions} accepted`}
            />
          </div>
        </section>

        {/* =====================================================
            PLATFORM OVERVIEW
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
          <div>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Platform Overview
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-600">
              Quick snapshot of platform health
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">

            {/* User Verification */}
            <div
              className="
                rounded-md
                border
                border-slate-200
                bg-slate-50
                p-4
                dark:border-white/10
                dark:bg-black/20
              "
            >
              <p className="text-xs text-slate-600 dark:text-slate-400">
                User Verification
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                {verificationRate}%
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Users verified successfully
              </p>
            </div>

            {/* Problem Library */}
            <div
              className="
                rounded-md
                border
                border-slate-200
                bg-slate-50
                p-4
                dark:border-white/10
                dark:bg-black/20
              "
            >
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Problem Library
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                {stats.totalProblems}
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Problems available to solve
              </p>
            </div>

            {/* Submission Success */}
            <div
              className="
                rounded-md
                border
                border-slate-200
                bg-slate-50
                p-4
                dark:border-white/10
                dark:bg-black/20
              "
            >
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Submission Success
              </p>

              <p className="mt-2 text-3xl font-bold text-orange-500 dark:text-orange-400">
                {acceptanceRate}%
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Overall platform acceptance rate
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            QUICK ACTIONS
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
          <div>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Quick Actions
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-600">
              Frequently used administrative tasks
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">

            {/* Create Problem */}
            <button
              onClick={() =>
                navigate("/admin/problems/create")
              }
              className="
                rounded-md
                border
                border-slate-200
                bg-slate-50
                px-4
                py-4
                text-left
                transition
                hover:border-orange-500/30
                hover:bg-orange-500/[0.03]
                dark:border-white/10
                dark:bg-black/20
                dark:hover:bg-white/[0.02]
              "
            >
              <p className="font-medium text-slate-900 dark:text-slate-200">
                Create Problem
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Add a new coding challenge
              </p>
            </button>

            {/* Create Contest */}
            <button
              onClick={() =>
                navigate("/admin/contests/create")
              }
              className="
                rounded-md
                border
                border-slate-200
                bg-slate-50
                px-4
                py-4
                text-left
                transition
                hover:border-orange-500/30
                hover:bg-orange-500/[0.03]
                dark:border-white/10
                dark:bg-black/20
                dark:hover:bg-white/[0.02]
              "
            >
              <p className="font-medium text-slate-900 dark:text-slate-200">
                Create Contest
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Schedule a new contest
              </p>
            </button>

            {/* Manage Users */}
            <button
              onClick={() =>
                navigate("/admin/users")
              }
              className="
                rounded-md
                border
                border-slate-200
                bg-slate-50
                px-4
                py-4
                text-left
                transition
                hover:border-orange-500/30
                hover:bg-orange-500/[0.03]
                dark:border-white/10
                dark:bg-black/20
                dark:hover:bg-white/[0.02]
              "
            >
              <p className="font-medium text-slate-900 dark:text-slate-200">
                Manage Users
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Review user accounts
              </p>
            </button>

          </div>
        </section>

      </div>
    </div>
  );
}

