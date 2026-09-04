import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Trophy,
  Plus,
  Pencil,
  Trash2,
  Rocket,
  Ban,
  Calendar,
} from "lucide-react";

import {
  contestService,
  type Contest,
} from "../services/contestService";

export default function ContestsPage() {
  const [contests, setContests] = useState<
    Contest[]
  >([]);

  useEffect(() => {
    loadContests();
  }, []);

  const loadContests = async () => {
    try {
      const response =
        await contestService.getContests();

      setContests(response.data.content);
    } catch (error) {
      console.error(error);
    }
  };

  const publishContest = async (
    contestId: number
  ) => {
    try {
      await contestService.publishContest(
        contestId
      );

      loadContests();
    } catch (error) {
      console.error(error);
    }
  };

  const cancelContest = async (
    contestId: number
  ) => {
    try {
      await contestService.cancelContest(
        contestId
      );

      loadContests();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteContest = async (
    contestId: number
  ) => {
    try {
      await contestService.deleteContest(
        contestId
      );

      loadContests();
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusColor = (
    status: string
  ) => {
    switch (status) {
      case "PUBLISHED":
        return `
          border-green-500/20
          bg-green-500/10
          text-green-600
          dark:text-green-400
        `;

      case "CANCELLED":
        return `
          border-red-500/20
          bg-red-500/10
          text-red-600
          dark:text-red-400
        `;

      case "DRAFT":
        return `
          border-yellow-500/20
          bg-yellow-500/10
          text-yellow-600
          dark:text-yellow-400
        `;

      default:
        return `
          border-slate-300
          bg-slate-100
          text-slate-600
          dark:border-slate-700
          dark:bg-slate-800
          dark:text-slate-400
        `;
    }
  };

  return (
    <div
      className="
        min-h-screen
        bg-white
        text-slate-900
        dark:bg-[#0a0a0b]
        dark:text-white
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section
        className="
          mb-5
          rounded-lg
          border
          border-slate-200
          bg-white
          dark:border-white/10
          dark:bg-[#111113]
        "
      >
        <div
          className="
            flex
            flex-col
            gap-5
            p-5
            sm:p-6
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          <div>
            <p
              className="
                mb-1.5
                font-mono
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.15em]
                text-orange-500
              "
            >
              // contest management
            </p>

            <h1
              className="
                flex
                items-center
                gap-3
                text-2xl
                font-bold
                tracking-tight
                text-slate-900
                dark:text-white
              "
            >
              <Trophy className="h-6 w-6 text-orange-500" />
              Contest
            </h1>

            <p
              className="
                mt-2
                text-sm
                text-slate-600
                dark:text-slate-400
              "
            >
              Create, publish and manage coding contests
              across the platform.
            </p>
          </div>

          <Link
            to="/admin/contests/create"
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-md
              bg-orange-500
              px-4
              py-2.5
              text-sm
              font-medium
              text-white
              transition-colors
              hover:bg-orange-400
            "
          >
            <Plus size={16} />
            New Contest
          </Link>
        </div>
      </section>

      {/* =====================================================
          STATS
      ===================================================== */}

      <section
        className="
          mb-6
          grid
          gap-3
          md:grid-cols-3
        "
      >
        <AdminContestStat
          label="Total Contests"
          value={contests.length}
        />

        <AdminContestStat
          label="Published"
          value={
            contests.filter(
              (contest) =>
                contest.status === "PUBLISHED"
            ).length
          }
          valueClass="text-emerald-500 dark:text-emerald-400"
        />

        <AdminContestStat
          label="Drafts"
          value={
            contests.filter(
              (contest) =>
                contest.status === "DRAFT"
            ).length
          }
          valueClass="text-amber-500 dark:text-amber-400"
        />
      </section>

      {/* =====================================================
          CONTEST LIST
      ===================================================== */}

      <section>
        <div
          className="
            mb-4
            flex
            items-end
            justify-between
            gap-4
          "
        >
          <div>
            <p
              className="
                font-mono
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-slate-900
                dark:text-slate-200
              "
            >
              // managed contests
            </p>

            <p
              className="
                mt-1.5
                text-xs
                text-slate-500
              "
            >
              Review, publish, edit, cancel or remove contests.
            </p>
          </div>

          <span
            className="
              shrink-0
              font-mono
              text-[11px]
              text-slate-500
            "
          >
            {contests.length}{" "}
            {contests.length === 1
              ? "contest"
              : "contests"}
          </span>
        </div>

        {contests.length === 0 ? (
          <div
            className="
              rounded-lg
              border
              border-slate-200
              bg-white
              px-6
              py-14
              text-center
              dark:border-white/10
              dark:bg-[#111113]
            "
          >
            <Calendar
              size={36}
              className="
                mx-auto
                text-slate-400
                dark:text-slate-600
              "
            />

            <h3
              className="
                mt-4
                text-sm
                font-semibold
                text-slate-900
                dark:text-slate-200
              "
            >
              No Contests Found
            </h3>

            <p
              className="
                mt-1.5
                text-xs
                text-slate-500
              "
            >
              Create your first contest to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {contests.map((contest) => (
              <div
                key={contest.id}
                className="
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  p-5
                  transition-colors
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
                    lg:items-start
                    lg:justify-between
                  "
                >
                  {/* Contest information */}

                  <div className="min-w-0">
                    <h2
                      className="
                        text-base
                        font-semibold
                        tracking-tight
                        text-slate-900
                        dark:text-slate-100
                      "
                    >
                      {contest.title}
                    </h2>

                    <div
                      className="
                        mt-3
                        flex
                        flex-wrap
                        gap-2
                      "
                    >
                      <span
                        className={`
                          rounded-md
                          border
                          px-2.5
                          py-1
                          font-mono
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-wider
                          ${getStatusColor(
                            contest.status
                          )}
                        `}
                      >
                        {contest.status}
                      </span>

                      <span
                        className="
                          rounded-md
                          border
                          border-slate-200
                          bg-slate-50
                          px-2.5
                          py-1
                          font-mono
                          text-[10px]
                          uppercase
                          tracking-wider
                          text-slate-500

                          dark:border-white/10
                          dark:bg-black/20
                          dark:text-slate-400
                        "
                      >
                        {contest.visibility}
                      </span>
                    </div>

                    <div
                      className="
                        mt-4
                        grid
                        gap-3
                        sm:grid-cols-2
                      "
                    >
                      <div>
                        <p
                          className="
                            font-mono
                            text-[10px]
                            uppercase
                            tracking-wider
                            text-slate-400
                            dark:text-slate-500
                          "
                        >
                          Start
                        </p>

                        <p
                          className="
                            mt-1
                            text-xs
                            text-slate-600
                            dark:text-slate-300
                          "
                        >
                          {new Date(
                            contest.startTime
                          ).toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p
                          className="
                            font-mono
                            text-[10px]
                            uppercase
                            tracking-wider
                            text-slate-400
                            dark:text-slate-500
                          "
                        >
                          End
                        </p>

                        <p
                          className="
                            mt-1
                            text-xs
                            text-slate-600
                            dark:text-slate-300
                          "
                        >
                          {new Date(
                            contest.endTime
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* =================================================
                      PRIMARY ACTIONS
                  ================================================= */}

                  <div
                    className="
                      flex
                      shrink-0
                      flex-wrap
                      gap-2
                    "
                  >
                    <Link
                      to={`/admin/contests/${contest.id}/edit`}
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-md
                        border
                        border-blue-500/20
                        bg-blue-500/10
                        px-3
                        py-2
                        text-xs
                        font-medium
                        text-blue-600
                        transition-colors
                        hover:bg-blue-500/20
                        dark:text-blue-400
                      "
                    >
                      <Pencil size={14} />
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        publishContest(contest.id)
                      }
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-md
                        border
                        border-emerald-500/20
                        bg-emerald-500/10
                        px-3
                        py-2
                        text-xs
                        font-medium
                        text-emerald-600
                        transition-colors
                        hover:bg-emerald-500/20
                        dark:text-emerald-400
                      "
                    >
                      <Rocket size={14} />
                      Publish
                    </button>
                  </div>
                </div>

                {/* =================================================
                    SECONDARY ACTIONS
                ================================================= */}

                <div
                  className="
                    my-5
                    border-t
                    border-slate-200
                    dark:border-white/10
                  "
                />

                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-2
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      cancelContest(contest.id)
                    }
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-md
                      border
                      border-amber-500/20
                      bg-amber-500/10
                      px-3
                      py-2
                      text-xs
                      font-medium
                      text-amber-600
                      transition-colors
                      hover:bg-amber-500/20
                      dark:text-amber-400
                    "
                  >
                    <Ban size={14} />
                    Cancel Contest
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteContest(contest.id)
                    }
                    className="
                      ml-auto
                      inline-flex
                      items-center
                      gap-2
                      rounded-md
                      border
                      border-red-500/20
                      bg-red-500/10
                      px-3
                      py-2
                      text-xs
                      font-medium
                      text-red-600
                      transition-colors
                      hover:bg-red-500/20
                      dark:text-red-400
                    "
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function AdminContestStat({
  label,
  value,
  valueClass = "text-slate-900 dark:text-white",
}: {
  label: string;
  value: number;
  valueClass?: string;
}) {
  return (
    <div
      className="
        rounded-lg
        border
        border-slate-200
        bg-white
        p-4
        dark:border-white/10
        dark:bg-[#111113]
      "
    >
      <p
        className="
          font-mono
          text-[10px]
          uppercase
          tracking-wider
          text-slate-500
        "
      >
        {label}
      </p>

      <p
        className={`
          mt-3
          font-mono
          text-2xl
          font-bold
          tracking-tight
          ${valueClass}
        `}
      >
        {value}
      </p>
    </div>
  );
}
