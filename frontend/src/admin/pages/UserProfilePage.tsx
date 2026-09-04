import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  Code2,
  Briefcase,
  Globe,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { userService } from "../services/userService";
import type { ProfileData } from "@/services/profile.service";
import { getErrorMessage } from "@/utils/error";

export default function AdminUserProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProfile(Number(id));
    }
  }, [id]);

  const loadProfile = async (userId: number) => {
    try {
      setLoading(true);

      const response = await userService.getUserProfile(userId);

      setProfile(response.data);
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Loading profile...
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-10 text-center dark:border-white/10 dark:bg-[#111113]">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          User profile not found.
        </p>

        <button
          onClick={() => navigate("/admin/users")}
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-500 dark:text-orange-400"
        >
          <ArrowLeft size={14} />
          Back to Users
        </button>
      </div>
    );
  }

  const isAdmin = profile.roles?.includes("ROLE_ADMIN");
  const avatarLetter = profile.fullName?.charAt(0).toUpperCase() || "U";

  return (
    <div className="space-y-8">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <section className="rounded-lg border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#111113]">
        <Link
          to="/admin/users"
          className="mb-4 inline-flex items-center gap-2 text-xs font-medium text-slate-500 transition hover:text-orange-500 dark:text-slate-400"
        >
          <ArrowLeft size={14} />
          Back to Users
        </Link>

        <p className="mb-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-500">
          User Management
        </p>

        <div className="flex items-center gap-3">
          <UserRound className="h-7 w-7 text-orange-500" />

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            User Profile
          </h1>
        </div>
      </section>

      {/* =====================================================
          PROFILE DETAILS
      ====================================================== */}

      <section className="rounded-lg border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#111113]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.fullName}
              className="h-16 w-16 shrink-0 rounded-full border border-slate-200 object-cover dark:border-white/10"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-orange-500/10 font-mono text-xl font-bold text-orange-600 dark:text-orange-400">
              {avatarLetter}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {profile.fullName}
              </h2>

              <span
                className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                  profile.enabled
                    ? "border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400"
                    : "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400"
                }`}
              >
                {profile.enabled ? "Active" : "Disabled"}
              </span>

              {isAdmin && (
                <span className="inline-flex items-center gap-1 rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-1 text-[11px] font-medium text-orange-600 dark:text-orange-400">
                  <ShieldCheck size={12} />
                  Admin
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {profile.email}
            </p>

            {profile.bio && (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {profile.bio}
              </p>
            )}

            <div className="mt-3 flex flex-wrap gap-4 text-xs">
              {profile.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-slate-500 transition hover:text-orange-500 dark:text-slate-400"
                >
                  <Code2 size={14} />
                  GitHub
                </a>
              )}

              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-slate-500 transition hover:text-orange-500 dark:text-slate-400"
                >
                  <Briefcase size={14} />
                  LinkedIn
                </a>
              )}

              {profile.websiteUrl && (
                <a
                  href={profile.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-slate-500 transition hover:text-orange-500 dark:text-slate-400"
                >
                  <Globe size={14} />
                  Website
                </a>
              )}
            </div>
          </div>
        </div>

        {/* =====================================================
            STATS GRID
        ====================================================== */}

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-200 pt-6 sm:grid-cols-4 dark:border-white/10">
          <Stat label="Rating" value={profile.rating} />
          <Stat label="Solved" value={profile.totalSolved} />
          <Stat label="Country" value={profile.country || "-"} />
          <Stat
            label="Joined"
            value={new Date(profile.createdAt).toLocaleDateString()}
          />
        </div>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div>
      <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 text-lg font-semibold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}
