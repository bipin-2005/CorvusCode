
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Code2, ArrowRight } from "lucide-react";

import {
  getAllProblems,
  type Problem,
} from "../services/problem.service";

type Difficulty = "EASY" | "MEDIUM" | "HARD";
type DifficultyFilter = "All" | Difficulty;

export default function ProblemsPage() {
  const navigate = useNavigate();

  const [problems, setProblems] = useState<Problem[]>([]);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] =
    useState<DifficultyFilter>("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD PROBLEMS
  ========================================================= */

  useEffect(() => {
    const loadProblems = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllProblems();

        setProblems(data);
      } catch (error) {
        console.error(
          "Failed to load problems:",
          error
        );

        setError("Unable to load problems.");
      } finally {
        setLoading(false);
      }
    };

    loadProblems();
  }, []);

  /* =========================================================
     STATISTICS
  ========================================================= */

  const easyCount = useMemo(
    () =>
      problems.filter(
        (problem) =>
          problem.difficulty === "EASY"
      ).length,
    [problems]
  );

  const mediumCount = useMemo(
    () =>
      problems.filter(
        (problem) =>
          problem.difficulty === "MEDIUM"
      ).length,
    [problems]
  );

  const hardCount = useMemo(
    () =>
      problems.filter(
        (problem) =>
          problem.difficulty === "HARD"
      ).length,
    [problems]
  );

  /* =========================================================
     FILTER
  ========================================================= */

  const filteredProblems = useMemo(() => {
    const searchText = search
      .trim()
      .toLowerCase();

    return problems.filter((problem) => {
      const matchesSearch =
        !searchText ||
        problem.title
          .toLowerCase()
          .includes(searchText) ||
        (problem.description ?? "")
          .toLowerCase()
          .includes(searchText);

      const matchesDifficulty =
        difficulty === "All" ||
        problem.difficulty === difficulty;

      return (
        matchesSearch &&
        matchesDifficulty
      );
    });
  }, [problems, search, difficulty]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white text-slate-500 dark:bg-[#0a0a0b] dark:text-slate-400">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-wider">
            Loading problems...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white dark:bg-[#0a0a0b]">
        <div className="text-center">
          <p className="text-sm text-rose-500 dark:text-rose-400">
            {error}
          </p>

          <button
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-[#0a0a0b] dark:text-white">
      <main className="mx-auto max-w-7xl">
        {/* =================================================
            PAGE HEADER
        ================================================= */}

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
              // practice
            </p>

            <h1
              className="
                flex
                items-center
                gap-3
                font-[var(--font-display)]
                text-2xl
                font-bold
                tracking-tight
                text-slate-900

                dark:text-white
              "
            >
              <Code2 className="h-6 w-6 text-orange-500" />

              Problems
            </h1>

            <p
              className="
                mt-2
                text-sm
                text-slate-600
                dark:text-slate-400
              "
            >
              Solve coding problems and improve
              your competitive programming skills.
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
              Total Problems
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
              {problems.length}
            </p>
          </div>
        </section>

        {/* =================================================
            DIFFICULTY OVERVIEW
        ================================================= */}

        <section className="mb-4 grid gap-3 sm:grid-cols-3">
          <DifficultyStat
            label="Easy"
            count={easyCount}
            color="easy"
          />

          <DifficultyStat
            label="Medium"
            count={mediumCount}
            color="medium"
          />

          <DifficultyStat
            label="Hard"
            count={hardCount}
            color="hard"
          />
        </section>

        {/* =================================================
            SEARCH + FILTER
        ================================================= */}

        <section
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
          <div className="flex flex-col gap-3 lg:flex-row">
            {/* Search */}

            <div className="relative flex-1">
              <Search
                className="
                  pointer-events-none
                  absolute
                  left-3
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-slate-400
                  dark:text-slate-600
                "
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search problems..."
                className="
                  h-10
                  w-full
                  rounded-md
                  border
                  border-slate-200
                  bg-white
                  pl-9
                  pr-3
                  text-xs
                  text-slate-800
                  outline-none
                  transition-colors
                  placeholder:text-slate-400
                  focus:border-orange-500/40

                  dark:border-white/15
                  dark:bg-black/20
                  dark:text-slate-300
                  dark:placeholder:text-slate-700
                "
              />
            </div>

            {/* Difficulty */}

            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(
                  e.target.value as DifficultyFilter
                )
              }
              className="
                h-10
                rounded-md
                border
                border-slate-200
                bg-white
                px-3
                text-xs
                font-medium
                text-slate-700
                outline-none
                transition-colors
                focus:border-orange-500/40

                dark:border-white/15
                dark:bg-black/20
                dark:text-slate-300
              "
            >
              <option
                value="All"
                className="bg-white text-slate-800 dark:bg-[#111113] dark:text-white"
              >
                All Difficulties
              </option>

              <option
                value="EASY"
                className="bg-white text-slate-800 dark:bg-[#111113] dark:text-white"
              >
                Easy
              </option>

              <option
                value="MEDIUM"
                className="bg-white text-slate-800 dark:bg-[#111113] dark:text-white"
              >
                Medium
              </option>

              <option
                value="HARD"
                className="bg-white text-slate-800 dark:bg-[#111113] dark:text-white"
              >
                Hard
              </option>
            </select>
          </div>
        </section>

        {/* =================================================
            LIST HEADER
        ================================================= */}

        <div className="mt-5 flex items-center justify-between">
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
              // problem set
            </h2>

            <p
              className="
                mt-1.5
                text-xs
                text-slate-500
                dark:text-slate-600
              "
            >
              Browse available coding challenges
            </p>
          </div>

          <span
            className="
              font-mono
              text-xs
              font-medium
              text-slate-500
            "
          >
            {filteredProblems.length}{" "}
            {filteredProblems.length === 1
              ? "problem"
              : "problems"}
          </span>
        </div>

        {/* =================================================
            PROBLEM LIST
        ================================================= */}

        <section
          className="
            mt-3
            overflow-hidden
            rounded-lg
            border
            border-slate-200
            bg-white

            dark:border-white/10
            dark:bg-[#111113]
          "
        >
          {filteredProblems.length === 0 ? (
            <EmptyState />
          ) : (
            filteredProblems.map(
              (problem, index) => (
                <ProblemRow
                  key={problem.id}
                  problem={problem}
                  index={index}
                  onClick={() =>
                    navigate(
                      `/problems/${problem.slug}`
                    )
                  }
                />
              )
            )
          )}
        </section>
      </main>
    </div>
  );
}

/* =========================================================
   DIFFICULTY STAT
========================================================= */

function DifficultyStat({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: "easy" | "medium" | "hard";
}) {
  const styles = {
    easy: {
      dot: "bg-emerald-500",
      text: "text-emerald-500 dark:text-emerald-400",
    },
    medium: {
      dot: "bg-amber-500",
      text: "text-amber-500 dark:text-amber-400",
    },
    hard: {
      dot: "bg-rose-500",
      text: "text-rose-500 dark:text-rose-400",
    },
  };

  const style = styles[color];

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
          <span
            className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
          />

          <span
            className="
              text-sm
              font-medium
              text-slate-700

              dark:text-slate-300
            "
          >
            {label}
          </span>
        </div>

        <span
          className={`
            font-mono
            text-lg
            font-bold
            ${style.text}
          `}
        >
          {count}
        </span>
      </div>

      <p
        className="
          mt-1
          text-[10px]
          text-slate-500
        "
      >
        {label.toLowerCase()} problems
      </p>
    </div>
  );
}

/* =========================================================
   PROBLEM ROW
========================================================= */

function ProblemRow({
  problem,
  index,
  onClick,
}: {
  problem: Problem;
  index: number;
  onClick: () => void;
}) {
  const difficultyStyles = {
    EASY: {
      badge:
        "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400",
      dot: "bg-emerald-500",
    },

    MEDIUM: {
      badge:
        "bg-amber-500/10 text-amber-500 dark:text-amber-400",
      dot: "bg-amber-500",
    },

    HARD: {
      badge:
        "bg-rose-500/10 text-rose-500 dark:text-rose-400",
      dot: "bg-rose-500",
    },
  };

  const difficultyLabels = {
    EASY: "Easy",
    MEDIUM: "Medium",
    HARD: "Hard",
  };

  const style =
    difficultyStyles[problem.difficulty] ??
    {
      badge:
        "bg-slate-500/10 text-slate-500",
      dot: "bg-slate-500",
    };

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        flex
        w-full
        items-center
        gap-4
        border-b
        border-slate-200
        px-5
        py-4
        text-left
        transition-colors
        last:border-b-0
        hover:bg-slate-50

        dark:border-white/10
        dark:hover:bg-black/20

        sm:px-6
      "
    >
      {/* Number */}

      <div
        className="
          hidden
          w-7
          shrink-0
          font-mono
          text-[10px]
          text-slate-400

          dark:text-slate-700

          sm:block
        "
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Status */}

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
          text-slate-400
          transition-colors

          group-hover:border-orange-500/30
          group-hover:text-orange-500

          dark:border-white/10
          dark:bg-black/20
          dark:text-slate-600
        "
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
        />
      </div>

      {/* Problem */}

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <h3
            className="
              truncate
              text-sm
              font-medium
              text-slate-700
              transition-colors

              group-hover:text-orange-500

              dark:text-slate-300
              dark:group-hover:text-white
            "
          >
            {problem.title}
          </h3>
        </div>

        <p
          className="
            mt-1
            truncate
            text-[11px]
            leading-5
            text-slate-500

            dark:text-slate-600
          "
        >
          {problem.description ||
            "No description available"}
        </p>
      </div>

      {/* Difficulty */}

      <span
        className={`
          hidden
          shrink-0
          rounded
          px-2.5
          py-1
          font-mono
          text-[9px]
          font-bold
          uppercase
          tracking-wide

          sm:block

          ${style.badge}
        `}
      >
        {difficultyLabels[
          problem.difficulty
        ] ?? problem.difficulty}
      </span>

      {/* Arrow */}

      <ArrowRight
        className="
          h-4
          w-4
          shrink-0
          text-slate-300
          transition-all

          group-hover:translate-x-0.5
          group-hover:text-orange-500

          dark:text-slate-700
        "
      />
    </button>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState() {
  return (
    <div className="px-6 py-16 text-center">
      <div
        className="
          mx-auto
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-md
          bg-slate-100
          text-slate-400

          dark:bg-black/20
          dark:text-slate-600
        "
      >
        <Search className="h-4 w-4" />
      </div>

      <p
        className="
          mt-4
          text-sm
          font-medium
          text-slate-800

          dark:text-slate-200
        "
      >
        No problems found
      </p>

      <p
        className="
          mt-1
          text-xs
          text-slate-500

          dark:text-slate-600
        "
      >
        Try a different search or difficulty.
      </p>
    </div>
  );
}
