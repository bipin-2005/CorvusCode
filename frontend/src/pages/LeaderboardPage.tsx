import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Medal,
  Trophy,
  Users,
  CheckCircle2,
} from "lucide-react";

import { getLeaderboard } from "../services/leaderboard.service";

interface LeaderboardEntry {
  rank: number;
  userId: number;
  fullName: string;
  score: number;
  solvedCount: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<
    LeaderboardEntry[]
  >([]);

  const [loading, setLoading] = useState(true);

  /* =========================================================
     LOAD LEADERBOARD
  ========================================================= */

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);

      const data = await getLeaderboard();

      setLeaderboard(data);
    } catch (error) {
      console.error(
        "Failed to load leaderboard:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     STATISTICS
  ========================================================= */

  const topScore = useMemo(
    () =>
      leaderboard.length > 0
        ? leaderboard[0].score
        : 0,
    [leaderboard]
  );

  const topSolved = useMemo(
    () =>
      leaderboard.length > 0
        ? leaderboard[0].solvedCount
        : 0,
    [leaderboard]
  );

  const totalSolved = useMemo(
    () =>
      leaderboard.reduce(
        (total, user) =>
          total + user.solvedCount,
        0
      ),
    [leaderboard]
  );

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
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
        <div
          className="
            flex
            min-h-[60vh]
            items-center
            justify-center
          "
        >
          <div className="text-center">
            <div
              className="
                mx-auto
                h-8
                w-8
                animate-spin
                rounded-full
                border-2
                border-slate-200
                border-t-orange-500
                dark:border-white/10
                dark:border-t-orange-500
              "
            />

            <p
              className="
                mt-4
                font-mono
                text-[11px]
                uppercase
                tracking-wider
                text-slate-500
              "
            >
              Loading leaderboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

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
          mb-6
          flex
          flex-col
          gap-5
          rounded-lg
          border
          border-slate-200
          bg-white
          p-6

          dark:border-white/10
          dark:bg-[#111113]

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
            // competitive programming
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
            <Medal className="h-6 w-6 text-orange-500" />

            Leaderboard
          </h1>

          <p
            className="
              mt-2
              max-w-2xl
              text-sm
              text-slate-600
              dark:text-slate-400
            "
          >
            Track rankings, scores, and solved
            problems across the platform.
          </p>
        </div>

        {/* Participants */}

        <div
          className="
            shrink-0
            rounded-md
            border
            border-slate-200
            bg-slate-50
            px-5
            py-3

            dark:border-white/10
            dark:bg-black/20
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
            Participants
          </p>

          <p
            className="
              mt-1
              font-mono
              text-2xl
              font-bold
              tracking-tight
              text-slate-900
              dark:text-white
            "
          >
            {leaderboard.length}
          </p>
        </div>
      </section>

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {leaderboard.length === 0 ? (
        <div
          className="
            rounded-lg
            border
            border-slate-200
            bg-white
            px-6
            py-16
            text-center

            dark:border-white/10
            dark:bg-[#111113]
          "
        >
          <div
            className="
              mx-auto
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-md
              bg-orange-500/10
              text-orange-500
            "
          >
            <Trophy className="h-5 w-5" />
          </div>

          <h2
            className="
              mt-4
              text-sm
              font-semibold
              text-slate-800
              dark:text-slate-200
            "
          >
            No rankings yet
          </h2>

          <p
            className="
              mt-1.5
              text-xs
              text-slate-500
            "
          >
            Rankings will appear after participants
            start solving problems.
          </p>
        </div>
      ) : (
        <>
          {/* =================================================
              STATS
          ================================================= */}

          <section
            className="
              mb-6
              grid
              gap-3
              sm:grid-cols-2
              xl:grid-cols-4
            "
          >
            <LeaderboardStat
              icon={Users}
              label="Participants"
              value={leaderboard.length}
            />

            <LeaderboardStat
              icon={Trophy}
              label="Top Score"
              value={topScore}
              accent="orange"
            />

            <LeaderboardStat
              icon={CheckCircle2}
              label="Highest Solved"
              value={topSolved}
              accent="green"
            />

            <LeaderboardStat
              icon={Activity}
              label="Problems Solved"
              value={totalSolved}
            />
          </section>

          {/* =================================================
              LEADERBOARD HEADER
          ================================================= */}

          <section>
            <div
              className="
                mb-4
                flex
                items-center
                justify-between
              "
            >
              <div>
                <h2
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
                  // ranked participants
                </h2>

                <p
                  className="
                    mt-1.5
                    text-xs
                    text-slate-500
                  "
                >
                  Sorted by score and solved
                  problems.
                </p>
              </div>

              <span
                className="
                  font-mono
                  text-xs
                  text-slate-500
                "
              >
                {leaderboard.length}{" "}
                {leaderboard.length === 1
                  ? "participant"
                  : "participants"}
              </span>
            </div>

            {/* =================================================
                TABLE
            ================================================= */}

            <div
              className="
                overflow-hidden
                rounded-lg
                border
                border-slate-200
                bg-white

                dark:border-white/10
                dark:bg-[#111113]
              "
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  {/* HEADER */}

                  <thead>
                    <tr
                      className="
                        border-b
                        border-slate-200
                        bg-slate-50

                        dark:border-white/10
                        dark:bg-black/20
                      "
                    >
                      <TableHeader>
                        Rank
                      </TableHeader>

                      <TableHeader>
                        Name
                      </TableHeader>

                      <TableHeader align="center">
                        Solved
                      </TableHeader>

                      <TableHeader align="right">
                        Score
                      </TableHeader>
                    </tr>
                  </thead>

                  {/* BODY */}

                  <tbody>
                    {leaderboard.map(
                      (user, index) => (
                        <LeaderboardRow
                          key={user.userId}
                          user={user}
                          index={index}
                        />
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function LeaderboardStat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Trophy;
  label: string;
  value: number;
  accent?: "orange" | "green";
}) {
  const valueClass =
    accent === "orange"
      ? "text-orange-500 dark:text-orange-400"
      : accent === "green"
        ? "text-emerald-500 dark:text-emerald-400"
        : "text-slate-900 dark:text-white";

  const iconClass =
    accent === "orange"
      ? "text-orange-500"
      : accent === "green"
        ? "text-emerald-500"
        : "text-slate-400 dark:text-slate-600";

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
      <div className="flex items-center gap-2">
        <Icon
          className={`h-4 w-4 ${iconClass}`}
        />

        <span
          className="
            font-mono
            text-[10px]
            uppercase
            tracking-wider
            text-slate-500
          "
        >
          {label}
        </span>
      </div>

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

/* =========================================================
   TABLE HEADER
========================================================= */

function TableHeader({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "center" | "right";
}) {
  const alignment =
    align === "center"
      ? "text-center"
      : align === "right"
        ? "text-right"
        : "text-left";

  return (
    <th
      className={`
        px-5
        py-3.5
        font-mono
        text-[10px]
        font-semibold
        uppercase
        tracking-wider
        text-slate-500
        ${alignment}
      `}
    >
      {children}
    </th>
  );
}

/* =========================================================
   LEADERBOARD ROW
========================================================= */

function LeaderboardRow({
  user,
  index,
}: {
  user: LeaderboardEntry;
  index: number;
}) {
  const rankStyle =
    user.rank === 1
      ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
      : user.rank === 2
        ? "bg-slate-500/10 text-slate-600 dark:text-slate-300"
        : user.rank === 3
          ? "bg-orange-500/10 text-orange-600 dark:text-orange-400"
          : "text-slate-500 dark:text-slate-500";

  return (
    <tr
      className="
        border-b
        border-slate-200
        transition-colors
        last:border-b-0
        hover:bg-slate-50

        dark:border-white/10
        dark:hover:bg-white/[0.02]
      "
    >
      {/* Rank */}

      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <span
            className={`
              inline-flex
              min-w-9
              items-center
              justify-center
              rounded-md
              px-2
              py-1
              font-mono
              text-xs
              font-semibold
              ${rankStyle}
            `}
          >
            #{user.rank}
          </span>

          {index < 3 && (
            <span
              className="
                hidden
                font-mono
                text-[9px]
                uppercase
                tracking-wider
                text-slate-400
                sm:inline
              "
            >
              {index === 0
                ? "1st"
                : index === 1
                  ? "2nd"
                  : "3rd"}
            </span>
          )}
        </div>
      </td>

      {/* Name */}

      <td className="px-5 py-4">
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
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
              border-slate-200
              bg-slate-50
              font-mono
              text-[10px]
              font-bold
              text-slate-500

              dark:border-white/10
              dark:bg-black/20
              dark:text-slate-400
            "
          >
            {user.fullName
              .charAt(0)
              .toUpperCase()}
          </div>

          <span
            className="
              text-sm
              font-medium
              text-slate-700
              dark:text-slate-300
            "
          >
            {user.fullName}
          </span>
        </div>
      </td>

      {/* Solved */}

      <td
        className="
          px-5
          py-4
          text-center
        "
      >
        <span
          className="
            font-mono
            text-sm
            font-semibold
            text-emerald-500
            dark:text-emerald-400
          "
        >
          {user.solvedCount}
        </span>
      </td>

      {/* Score */}

      <td
        className="
          px-5
          py-4
          text-right
        "
      >
        <span
          className="
            font-mono
            text-sm
            font-bold
            text-orange-500
            dark:text-orange-400
          "
        >
          {user.score}
        </span>
      </td>
    </tr>
  );
}

