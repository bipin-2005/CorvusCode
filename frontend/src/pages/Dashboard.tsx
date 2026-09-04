import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/token";
import {
  getMySubmissions,
  type Submission,
} from "../services/submission.service";
import {
  getAllProblems,
  type Problem,
} from "../services/problem.service";
import { getAllContests } from "@/services/contest.service";

export default function Dashboard() {
  const user = getUser();

  const fullName = user?.fullName || "User";
  const firstName = fullName.split(" ")[0];
  const avatarLetter = fullName.charAt(0).toUpperCase();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);
  const [upcomingContest, setUpcomingContest] = useState<any>(null);

  /* =========================================================
     LOAD SUBMISSIONS
  ========================================================= */

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        setLoadingSubmissions(true);

        const data = await getMySubmissions();

        setSubmissions(data);
      } catch (error) {
        console.error(
          "Failed to load dashboard submissions:",
          error
        );
      } finally {
        setLoadingSubmissions(false);
      }
    };

    loadSubmissions();
  }, []);

  /* =========================================================
     LOAD UPCOMING CONTEST
  ========================================================= */

  useEffect(() => {
    const loadUpcomingContest = async () => {
      try {
        const data = await getAllContests();

        const upcoming = data.content
          .filter(
            (contest) => contest.status === "UPCOMING"
          )
          .sort(
            (a, b) =>
              new Date(a.startTime).getTime() -
              new Date(b.startTime).getTime()
          )[0];

        setUpcomingContest(upcoming ?? null);
      } catch (error) {
        console.error(
          "Failed to load upcoming contest:",
          error
        );
      }
    };

    loadUpcomingContest();
  }, []);

  /* =========================================================
     STATISTICS
  ========================================================= */

  const totalSubmissions = submissions.length;

  const acceptedSubmissions = submissions.filter(
    (submission) => submission.status === "ACCEPTED"
  ).length;

  const solvedProblems = new Set(
    submissions
      .filter(
        (submission) =>
          submission.status === "ACCEPTED"
      )
      .map(
        (submission) =>
          submission.problemId
      )
  ).size;

  const acceptanceRate =
    totalSubmissions === 0
      ? 0
      : Math.round(
          (acceptedSubmissions /
            totalSubmissions) *
            100
        );

  /* =========================================================
     PROBLEMS
  ========================================================= */

  const [problems, setProblems] =
    useState<Problem[]>([]);

  const [loadingProblems, setLoadingProblems] =
    useState(true);

  useEffect(() => {
    const loadProblems = async () => {
      try {
        const data = await getAllProblems();

        setProblems(data);
      } catch (error) {
        console.error(
          "Failed to load problems:",
          error
        );
      } finally {
        setLoadingProblems(false);
      }
    };

    loadProblems();
  }, []);

  /* =========================================================
     PROBLEM PROGRESS CALCULATIONS
  ========================================================= */

  const acceptedProblemIds = new Set(
    submissions
      .filter(
        (submission) =>
          submission.status === "ACCEPTED"
      )
      .map(
        (submission) =>
          submission.problemId
      )
  );

  const easyProblems = problems.filter(
    (problem) =>
      problem.difficulty === "EASY"
  );

  const mediumProblems = problems.filter(
    (problem) =>
      problem.difficulty === "MEDIUM"
  );

  const hardProblems = problems.filter(
    (problem) =>
      problem.difficulty === "HARD"
  );

  const easySolved = easyProblems.filter(
    (problem) =>
      acceptedProblemIds.has(problem.id)
  ).length;

  const mediumSolved = mediumProblems.filter(
    (problem) =>
      acceptedProblemIds.has(problem.id)
  ).length;

  const hardSolved = hardProblems.filter(
    (problem) =>
      acceptedProblemIds.has(problem.id)
  ).length;

  /* =========================================================
     SUBMISSION HEATMAP
  ========================================================= */

  const heatmapData = useMemo(
    () => createHeatmapData(submissions),
    [submissions]
  );

  /* =========================================================
     STREAK
  ========================================================= */

  const currentStreak = heatmapData.currentStreak;
  const longestStreak = heatmapData.longestStreak;

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-[#0a0a0b] dark:text-white">

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="mb-6 flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#111113] lg:flex-row lg:items-center lg:justify-between">

        <div>
          <p className="mb-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-500">
            // dashboard
          </p>

          <h1 className="font-[var(--font-display)] text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back, {firstName}
          </h1>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Track your progress, review submissions,
            and keep improving your competitive
            programming skills.
          </p>
        </div>

        <button
          onClick={() => navigate("/problems")}
          className="inline-flex shrink-0 items-center gap-2 rounded-md bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-400"
        >
          Browse Problems
          <span>→</span>
        </button>
      </section>

      {/* =================================================
          STAT CARDS
      ================================================= */}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          label="Problems Solved"
          value={String(solvedProblems)}
          detail="unique problems"
        />

        <StatCard
          label="Acceptance Rate"
          value={`${acceptanceRate}%`}
          detail={`${acceptedSubmissions} accepted`}
        />

        <StatCard
          label="Current Streak"
          value={String(currentStreak)}
          detail={
            currentStreak === 1
              ? "day"
              : "days"
          }
        />

        <StatCard
          label="Submissions"
          value={String(totalSubmissions)}
          detail="total submissions"
        />

      </section>

      {/* =================================================
          SUBMISSION HEATMAP
      ================================================= */}

      <section className="mt-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#111113]">

        {/* Header */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

          <div>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              // submission activity
            </h2>

            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-500">
              Your coding activity over the last year
            </p>
          </div>

          <div className="flex gap-6">

            <div className="text-right">
              <p className="font-mono text-lg font-bold text-slate-900 dark:text-white">
                {heatmapData.yearTotal}
              </p>

              <p className="text-[10px] text-slate-500">
                submissions
              </p>
            </div>

            <div className="text-right">
              <p className="font-mono text-lg font-bold text-orange-500">
                {longestStreak}
              </p>

              <p className="text-[10px] text-slate-500">
                longest streak
              </p>
            </div>

          </div>

        </div>

        {/* Heatmap */}

        <div className="mt-6 overflow-x-auto pb-2">

          <div className="min-w-[720px]">

            {/* Month labels */}

            <div className="relative ml-9 h-5">

              {heatmapData.monthLabels.map(
                (month) => (
                  <span
                    key={`${month.label}-${month.index}`}
                    className="absolute text-[10px] text-slate-500"
                    style={{
                      left: `${month.index * 14}px`,
                    }}
                  >
                    {month.label}
                  </span>
                )
              )}

            </div>

            <div className="flex">

              {/* Weekday labels */}

              <div className="mr-2 flex w-7 flex-col justify-between py-[2px]">

                <span className="text-[9px] text-slate-500">
                  Mon
                </span>

                <span className="text-[9px] text-slate-500">
                  Wed
                </span>

                <span className="text-[9px] text-slate-500">
                  Fri
                </span>

              </div>

              {/* Grid */}

              <div className="flex gap-[3px]">

                {heatmapData.weeks.map(
                  (week, weekIndex) => (
                    <div
                      key={weekIndex}
                      className="flex flex-col gap-[3px]"
                    >

                      {week.map((day) => (
                        <HeatmapCell
                          key={day.date}
                          day={day}
                        />
                      ))}

                    </div>
                  )
                )}

              </div>

            </div>

          </div>

        </div>

        {/* Legend */}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">

          <div className="flex items-center gap-2">

            <span className="text-[10px] text-slate-500">
              Less
            </span>

            <div className="h-3 w-3 rounded-[3px] border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800" />

            <div className="h-3 w-3 rounded-[3px] bg-orange-200 dark:bg-orange-950" />

            <div className="h-3 w-3 rounded-[3px] bg-orange-300 dark:bg-orange-800" />

            <div className="h-3 w-3 rounded-[3px] bg-orange-400 dark:bg-orange-600" />

            <div className="h-3 w-3 rounded-[3px] bg-orange-500" />

            <span className="text-[10px] text-slate-500">
              More
            </span>

          </div>

          <p className="text-[10px] text-slate-500">
            {heatmapData.activeDays} active days
          </p>

        </div>

      </section>

      {/* =================================================
          MAIN GRID
      ================================================= */}

      <section className="mt-4 grid gap-4 xl:grid-cols-3">

        {/* =================================================
            RECENT SUBMISSIONS
        ================================================= */}

        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#111113] xl:col-span-2">

          {/* Header */}

          <div className="flex items-center justify-between">

            <div>
              <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                // recent submissions
              </h2>

              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-500">
                Your latest coding activity
              </p>
            </div>

            <button
              onClick={() =>
                navigate("/submissions")
              }
              className="flex items-center gap-1 text-xs font-medium text-slate-500 transition-colors hover:text-orange-500"
            >
              View all

              <span className="text-orange-500">
                →
              </span>
            </button>

          </div>

          {/* Submission List */}

          <div className="mt-4 divide-y divide-slate-200 dark:divide-white/10">

            {loadingSubmissions ? (

              <div className="py-10 text-center">

                <p className="text-xs text-slate-500 dark:text-slate-600">
                  Loading submissions...
                </p>

              </div>

            ) : submissions.length === 0 ? (

              <div className="py-10 text-center">

                <p className="text-xs text-slate-500 dark:text-slate-600">
                  No submissions yet.
                </p>

                <button
                  onClick={() =>
                    navigate("/problems")
                  }
                  className="mt-4 text-xs font-medium text-orange-500 transition hover:text-orange-400"
                >
                  Start solving →
                </button>

              </div>

            ) : (

              submissions
                .slice()
                .sort(
                  (a, b) =>
                    new Date(
                      b.submittedAt
                    ).getTime() -
                    new Date(
                      a.submittedAt
                    ).getTime()
                )
                .slice(0, 5)
                .map((submission) => (

                  <Submission
                    key={submission.id}
                    problem={
                      submission.problemTitle
                    }
                    language={
                      submission.language
                    }
                    status={formatSubmissionStatus(
                      submission.status
                    )}
                    time={formatRelativeTime(
                      submission.submittedAt
                    )}
                  />

                ))

            )}

          </div>

        </div>

        {/* =================================================
            UPCOMING CONTEST
        ================================================= */}

        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#111113]">

          {/* Header */}

          <div className="flex items-start justify-between">

            <div>

              <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                // upcoming contest
              </h2>

              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-600">
                Put your skills to the test
              </p>

            </div>

            <span className="rounded border border-orange-500/25 bg-orange-500/10 px-2 py-1 font-mono text-[9px] font-bold tracking-wide text-orange-500">
              RANKED
            </span>

          </div>

          {/* Contest */}

          <div className="mt-6">

            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-200">
              {upcomingContest?.title ??
                "No Upcoming Contest"}
            </h3>

            <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-500">
              {upcomingContest?.description ??
                "No contest scheduled."}
            </p>

          </div>

          {/* Contest Details */}

          <div className="mt-5 space-y-3 rounded-md border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-black/30">

            <div className="flex items-center justify-between text-xs">

              <span className="text-slate-500 dark:text-slate-600">
                Start
              </span>

              <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                {upcomingContest
                  ? new Date(
                      upcomingContest.startTime
                    ).toLocaleDateString()
                  : "-"}
              </span>

            </div>

            <div className="flex items-center justify-between text-xs">

              <span className="text-slate-500 dark:text-slate-600">
                Duration
              </span>

              <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                {upcomingContest
                  ? `${upcomingContest.durationMinutes} min`
                  : "-"}
              </span>

            </div>

          </div>

          {/* Button */}

          <button
            onClick={() => {
              if (upcomingContest?.id) {
                navigate(
                  `/contests/${upcomingContest.id}`
                );
              }
            }}
            disabled={!upcomingContest}
            className="
              mt-5
              w-full
              rounded-md
              bg-orange-500
              py-2.5
              text-xs
              font-semibold
              text-white
              transition-colors
              hover:bg-orange-400
              disabled:cursor-not-allowed
              disabled:bg-slate-300
              dark:disabled:bg-white/10
              dark:disabled:text-slate-500
            "
          >
            {upcomingContest
              ? "View Contest"
              : "No Contest Available"}
          </button>

        </div>

      </section>

      {/* =================================================
          PROBLEM PROGRESS
      ================================================= */}

      <section className="mt-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#111113]">

        {/* Header */}

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              // problem progress
            </h2>

            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-600">
              Your progress by difficulty
            </p>

          </div>

          <span className="font-mono text-xs font-medium text-slate-500">
            {solvedProblems} / {problems.length} solved
          </span>

        </div>

        {/* Progress Cards */}

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <Progress
            label="Easy"
            solved={easySolved}
            total={easyProblems.length}
          />

          <Progress
            label="Medium"
            solved={mediumSolved}
            total={mediumProblems.length}
          />

          <Progress
            label="Hard"
            solved={hardSolved}
            total={hardProblems.length}
          />

        </div>

      </section>

    </div>
  );
}

/* =========================================================
   HEATMAP TYPES
========================================================= */

interface HeatmapDay {
  date: string;
  count: number;
  level: number;
}

interface HeatmapResult {
  weeks: HeatmapDay[][];
  monthLabels: {
    label: string;
    index: number;
  }[];
  currentStreak: number;
  longestStreak: number;
  yearTotal: number;
  activeDays: number;
}

/* =========================================================
   CREATE HEATMAP DATA
========================================================= */

function createHeatmapData(
  submissions: Submission[]
): HeatmapResult {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  /*
   * Start from 364 days ago.
   *
   * Then move backwards to Sunday so the grid
   * always contains complete weeks.
   */

  const start = new Date(today);

  start.setDate(
    start.getDate() - 364
  );

  start.setDate(
    start.getDate() - start.getDay()
  );

  const submissionCounts =
    new Map<string, number>();

  submissions.forEach((submission) => {
    const date = new Date(
      submission.submittedAt
    );

    if (Number.isNaN(date.getTime())) {
      return;
    }

    const key = getDateKey(date);

    submissionCounts.set(
      key,
      (submissionCounts.get(key) ?? 0) + 1
    );
  });

  const days: HeatmapDay[] = [];

  const cursor = new Date(start);

  /*
   * 53 weeks × 7 days.
   */

  for (let i = 0; i < 371; i++) {
    const key = getDateKey(cursor);

    const count =
      submissionCounts.get(key) ?? 0;

    days.push({
      date: key,
      count,
      level: getHeatmapLevel(count),
    });

    cursor.setDate(
      cursor.getDate() + 1
    );
  }

  /*
   * Convert into columns.
   *
   * Each column = one week.
   */

  const weeks: HeatmapDay[][] = [];

  for (
    let i = 0;
    i < days.length;
    i += 7
  ) {
    weeks.push(
      days.slice(i, i + 7)
    );
  }

  /*
   * Month labels.
   */

  const monthLabels: {
    label: string;
    index: number;
  }[] = [];

  weeks.forEach((week, index) => {
    const firstDay = week[0];

    if (!firstDay) {
      return;
    }

    const date = parseDateKey(
      firstDay.date
    );

    /*
     * Display a month when its first
     * day appears in the week.
     */

    if (
      date.getDate() <= 7 ||
      index === 0
    ) {
      monthLabels.push({
        label: date.toLocaleDateString(
          "en-US",
          {
            month: "short",
          }
        ),
        index,
      });
    }
  });

  /*
   * Current streak.
   */

  let currentStreak = 0;

  const streakCursor = new Date(today);

  /*
   * If today has no submission,
   * check whether yesterday starts
   * the current streak.
   */

  const todayKey =
    getDateKey(streakCursor);

  if (
    (submissionCounts.get(todayKey) ??
      0) === 0
  ) {
    streakCursor.setDate(
      streakCursor.getDate() - 1
    );
  }

  while (true) {
    const key =
      getDateKey(streakCursor);

    const count =
      submissionCounts.get(key) ?? 0;

    if (count === 0) {
      break;
    }

    currentStreak++;

    streakCursor.setDate(
      streakCursor.getDate() - 1
    );
  }

  /*
   * Longest streak.
   */

  const sortedActiveDates =
    Array.from(
      submissionCounts.entries()
    )
      .filter(
        ([, count]) => count > 0
      )
      .map(([date]) => date)
      .sort();

  let longestStreak = 0;
  let runningStreak = 0;
  let previousDate: Date | null = null;

  sortedActiveDates.forEach(
    (dateString) => {
      const date =
        parseDateKey(dateString);

      if (!previousDate) {
        runningStreak = 1;
      } else {
        const difference =
          Math.round(
            (date.getTime() -
              previousDate.getTime()) /
              (1000 * 60 * 60 * 24)
          );

        if (difference === 1) {
          runningStreak++;
        } else {
          runningStreak = 1;
        }
      }

      longestStreak = Math.max(
        longestStreak,
        runningStreak
      );

      previousDate = date;
    }
  );

  const yearTotal =
    days.reduce(
      (sum, day) =>
        sum + day.count,
      0
    );

  const activeDays =
    days.filter(
      (day) => day.count > 0
    ).length;

  return {
    weeks,
    monthLabels,
    currentStreak,
    longestStreak,
    yearTotal,
    activeDays,
  };
}

/* =========================================================
   HEATMAP LEVEL
========================================================= */

function getHeatmapLevel(
  count: number
): number {
  if (count <= 0) {
    return 0;
  }

  if (count <= 2) {
    return 1;
  }

  if (count <= 5) {
    return 2;
  }

  if (count <= 9) {
    return 3;
  }

  return 4;
}

/* =========================================================
   DATE KEY
========================================================= */

function getDateKey(
  date: Date
): string {
  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* =========================================================
   PARSE DATE KEY
========================================================= */

function parseDateKey(
  key: string
): Date {
  const [year, month, day] =
    key.split("-").map(Number);

  return new Date(
    year,
    month - 1,
    day
  );
}

/* =========================================================
   HEATMAP CELL
========================================================= */

function HeatmapCell({
  day,
}: {
  day: HeatmapDay;
}) {
  const levelClasses = [
    "border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-white/5",
    "border border-orange-200 bg-orange-200 dark:border-orange-950 dark:bg-orange-950",
    "border border-orange-300 bg-orange-300 dark:border-orange-800 dark:bg-orange-800",
    "border border-orange-400 bg-orange-400 dark:border-orange-600 dark:bg-orange-600",
    "border border-orange-500 bg-orange-500",
  ];

  const formattedDate =
    parseDateKey(
      day.date
    ).toLocaleDateString(
      "en-US",
      {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );

  const submissionText =
    day.count === 1
      ? "1 submission"
      : `${day.count} submissions`;

  return (
    <div
      title={`${formattedDate} — ${submissionText}`}
      className={`
        h-[11px]
        w-[11px]
        shrink-0
        rounded-[3px]
        transition
        hover:ring-2
        hover:ring-orange-400/50
        ${levelClasses[day.level]}
      `}
      aria-label={`${formattedDate}: ${submissionText}`}
    />
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-lg
        border
        border-slate-200
        bg-white
        p-4
        transition-colors
        duration-150
        hover:border-orange-500/40

        dark:border-white/10
        dark:bg-[#111113]
        dark:hover:border-orange-500/40
      "
    >

      {/* Accent */}

      <div className="absolute left-0 top-0 h-full w-0.5 bg-orange-500/0 transition-colors group-hover:bg-orange-500" />

      {/* Label */}

      <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </p>

      {/* Value */}

      <div className="mt-3 flex items-end justify-between gap-4">

        <p className="font-mono text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {value}
        </p>

        <span className="pb-1 text-[10px] font-medium text-slate-500">
          {detail}
        </span>

      </div>

    </div>
  );
}

/* =========================================================
   SUBMISSION
========================================================= */

function Submission({
  problem,
  language,
  status,
  time,
}: {
  problem: string;
  language: string;
  status: string;
  time: string;
}) {
  const accepted =
    status?.toUpperCase() ===
    "ACCEPTED";

  return (
    <div className="group flex items-center justify-between gap-4 py-4">

      {/* Left */}

      <div className="flex min-w-0 items-center gap-3">

        {/* Status Icon */}

        <div
          className={`
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-lg
            text-xs
            font-semibold

            ${
              accepted
                ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400"
                : "bg-rose-500/10 text-rose-500 dark:text-rose-400"
            }
            font-mono
          `}
        >
          {accepted ? "✓" : "×"}
        </div>

        {/* Information */}

        <div className="min-w-0">

          <p className="truncate text-sm font-medium text-slate-700 transition-colors group-hover:text-orange-500 dark:text-slate-300 dark:group-hover:text-white">
            {problem}
          </p>

          <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-600">

            <span className="font-mono">
              {language}
            </span>

            <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />

            <span>
              {time}
            </span>

          </div>

        </div>

      </div>

      {/* Status */}

      <span
        className={`
          shrink-0
          rounded
          px-2
          py-1
          font-mono
          text-[9px]
          font-bold

          ${
            accepted
              ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400"
              : "bg-rose-500/10 text-rose-500 dark:text-rose-400"
          }
        `}
      >
        {status.toUpperCase()}
      </span>

    </div>
  );
}

/* =========================================================
   PROGRESS
========================================================= */

function Progress({
  label,
  solved,
  total,
}: {
  label: string;
  solved: number;
  total: number;
}) {
  const percentage =
    total === 0
      ? 0
      : Math.round(
          (solved / total) * 100
        );

  const dotClass =
    label === "Easy"
      ? "bg-emerald-500"
      : label === "Medium"
      ? "bg-amber-500"
      : "bg-rose-500";

  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-black/20">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2">

          <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />

          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
          </span>

          <span className="font-mono text-[10px] text-slate-500 dark:text-slate-600">
            {solved}/{total}
          </span>

        </div>

        <span className="font-mono text-xs font-medium text-slate-500">
          {percentage}%
        </span>

      </div>

      {/* Bar */}

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">

        <div
          className={`h-full rounded-full transition-all duration-500 ${dotClass}`}
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
}

/* =========================================================
   SUBMISSION STATUS
========================================================= */

function formatSubmissionStatus(
  status: Submission["status"]
) {
  return status.replaceAll("_", " ");
}

/* =========================================================
   RELATIVE TIME
========================================================= */

function formatRelativeTime(
  date: string
) {
  const submittedAt =
    new Date(date);

  const now = new Date();

  const difference =
    now.getTime() -
    submittedAt.getTime();

  const minutes = Math.floor(
    difference /
      (1000 * 60)
  );

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(
    minutes / 60
  );

  if (hours < 24) {
    return `${hours} hour${
      hours === 1 ? "" : "s"
    } ago`;
  }

  const days = Math.floor(
    hours / 24
  );

  if (days < 7) {
    return `${days} day${
      days === 1 ? "" : "s"
    } ago`;
  }

  return submittedAt.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}