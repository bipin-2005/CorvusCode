import { useEffect, useMemo, useState } from "react";
import ContestCard from "../components/contest/ContestCard";
import { getAllContests } from "../services/contest.service";
import type { Contest } from "../types/contest";
import {
  Trophy,
  CalendarDays,
  Activity,
  Users,
} from "lucide-react";

const ContestsPage = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD CONTESTS
  ========================================================= */

  useEffect(() => {
    const loadContests = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllContests();

        console.log("DATA =", data);
        console.log("CONTENT =", data.content);

        setContests(data.content || []);
      } catch (error) {
        console.error(
          "Failed to load contests:",
          error
        );

        setError("Unable to load contests.");
      } finally {
        setLoading(false);
      }
    };

    loadContests();
  }, []);

  /* =========================================================
     CONTEST STATISTICS
  ========================================================= */

  const upcomingContests = useMemo(
    () =>
      contests.filter(
        (contest) =>
          contest.status === "UPCOMING"
      ),
    [contests]
  );

  const liveContests = useMemo(
    () =>
      contests.filter(
        (contest) =>
          contest.status === "ONGOING" ||
          contest.status === "LIVE"
      ),
    [contests]
  );

  const completedContests = useMemo(
    () =>
      contests.filter(
        (contest) =>
          contest.status === "COMPLETED" ||
          contest.status === "ENDED"
      ),
    [contests]
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-[#0a0a0b] dark:text-white">

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
            <Trophy className="h-6 w-6 text-orange-500" />

            Contests
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
            Participate in coding contests, improve
            your ranking, and challenge yourself
            against other developers.
          </p>
        </div>

        {/* Total */}

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
            Total Contests
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
            {contests.length}
          </p>
        </div>
      </section>

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (
        <div
          className="
            rounded-lg
            border
            border-slate-200
            bg-white
            p-14
            text-center

            dark:border-white/10
            dark:bg-[#111113]
          "
        >
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
            Loading contests...
          </p>
        </div>
      )}

      {/* =====================================================
          ERROR
      ===================================================== */}

      {!loading && error && (
        <div
          className="
            rounded-lg
            border
            border-rose-500/20
            bg-rose-500/5
            p-10
            text-center
          "
        >
          <p
            className="
              text-sm
              text-rose-500
              dark:text-rose-400
            "
          >
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="
              mt-4
              rounded-md
              border
              border-slate-300
              px-4
              py-2
              text-xs
              font-medium
              text-slate-600
              transition-colors
              hover:border-orange-500/40
              hover:text-orange-500

              dark:border-white/15
              dark:text-slate-400
              dark:hover:text-white
            "
          >
            Try Again
          </button>
        </div>
      )}

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {!loading &&
        !error &&
        contests.length === 0 && (
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
              No contests available
            </h2>

            <p
              className="
                mt-1.5
                text-xs
                text-slate-500
              "
            >
              New contests will appear here
              when they are published.
            </p>
          </div>
        )}

      {/* =====================================================
          CONTENT
      ===================================================== */}

      {!loading &&
        !error &&
        contests.length > 0 && (
          <>
            {/* =================================================
                STATISTICS
            ================================================= */}

            <section className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

              <ContestStat
                icon={Trophy}
                label="Total"
                value={contests.length}
              />

              <ContestStat
                icon={CalendarDays}
                label="Upcoming"
                value={upcomingContests.length}
                accent="orange"
              />

              <ContestStat
                icon={Activity}
                label="Live"
                value={liveContests.length}
                accent="green"
              />

              <ContestStat
                icon={Users}
                label="Completed"
                value={completedContests.length}
              />

            </section>

            {/* =================================================
                CONTEST LIST HEADER
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
                    // contest arena
                  </h2>

                  <p
                    className="
                      mt-1.5
                      text-xs
                      text-slate-500
                    "
                  >
                    Browse and participate in
                    coding competitions
                  </p>
                </div>

                <span
                  className="
                    font-mono
                    text-xs
                    text-slate-500
                  "
                >
                  {contests.length}{" "}
                  {contests.length === 1
                    ? "contest"
                    : "contests"}
                </span>
              </div>

              {/* =================================================
                  CONTEST GRID
              ================================================= */}

              <div
                className="
                  grid
                  auto-rows-fr
                  gap-4
                  md:grid-cols-2
                  xl:grid-cols-3
                "
              >
                {contests.map((contest) => (
                  <ContestCard
                    key={contest.id}
                    contest={contest}
                  />
                ))}
              </div>
            </section>
          </>
        )}
    </div>
  );
};

/* =========================================================
   CONTEST STAT
========================================================= */

function ContestStat({
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
      <div className="flex items-center justify-between">
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

export default ContestsPage;
