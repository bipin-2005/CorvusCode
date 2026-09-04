import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Power,
  FlaskConical,
  Code2,
  PlayCircle,
  Trash2,
} from "lucide-react";

import {
  problemService,
  type AdminProblem,
} from "../services/problemService";

export default function ProblemsPage() {
  const [problems, setProblems] = useState<
    AdminProblem[]
  >([]);

  const [search, setSearch] = useState("");

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    try {
      const response =
        await problemService.getProblems();

      setProblems(response.data.content);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleProblem = async (
    problem: AdminProblem
  ) => {
    try {
      if (problem.active) {
        await problemService.deactivateProblem(
          problem.id
        );
      } else {
        await problemService.activateProblem(
          problem.id
        );
      }

      await loadProblems();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProblem = async (
    problemId: number
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this problem?"
    );

    if (!confirmed) return;

    try {
      await problemService.deleteProblem(
        problemId
      );

      loadProblems();
    } catch (error) {
      console.error(error);
    }
  };

  const getDifficultyColor = (
    difficulty: string
  ) => {
    switch (difficulty) {
      case "EASY":
        return `
          border-green-500/20
          bg-green-500/10
          text-green-600
          dark:text-green-400
        `;

      case "MEDIUM":
        return `
          border-yellow-500/20
          bg-yellow-500/10
          text-yellow-600
          dark:text-yellow-400
        `;

      case "HARD":
        return `
          border-red-500/20
          bg-red-500/10
          text-red-600
          dark:text-red-400
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

const filteredProblems =
  problems.filter((problem) => {
    const searchText =
      search.toLowerCase();

    return (
      problem.title
        .toLowerCase()
        .includes(searchText) ||
      (problem.description ?? "")
        .toLowerCase()
        .includes(searchText)
    );
  });

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
              // problem management
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
              <Code2 className="h-6 w-6 text-orange-500" />
              Problems
            </h1>

            <p
              className="
                mt-2
                max-w-2xl
                text-sm
                leading-6
                text-slate-600
                dark:text-slate-400
              "
            >
              Manage coding challenges, examples,
              test cases and starter code templates.
            </p>
          </div>

          <Link
            to="/admin/problems/create"
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
            New Problem
          </Link>
        </div>
      </section>

      {/* =====================================================
          STATS
      ===================================================== */}

      <section
        className="
          mb-5
          grid
          gap-3
          md:grid-cols-3
        "
      >
        <ProblemStat
          label="Total Problems"
          value={problems.length}
        />

        <ProblemStat
          label="Active Problems"
          value={
            problems.filter(
              (problem) => problem.active
            ).length
          }
          valueClass="
            text-emerald-500
            dark:text-emerald-400
          "
        />

        <ProblemStat
          label="Inactive Problems"
          value={
            problems.filter(
              (problem) => !problem.active
            ).length
          }
          valueClass="
            text-red-500
            dark:text-red-400
          "
        />
      </section>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <section
        className="
          mb-5
          rounded-lg
          border
          border-slate-200
          bg-white
          p-4
          dark:border-white/10
          dark:bg-[#111113]
        "
      >
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
              bg-orange-500/10
              text-orange-500
            "
          >
            <Code2 size={15} />
          </div>

          <div className="min-w-0 flex-1">
            <p
              className="
                font-mono
                text-[10px]
                font-semibold
                uppercase
                tracking-wider
                text-slate-500
              "
            >
              // search problems
            </p>

            <input
              type="text"
              placeholder="Search by title or description..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="
                mt-2
                w-full
                rounded-md
                border
                border-slate-200
                bg-slate-50
                px-3
                py-2.5
                text-sm
                text-slate-900
                outline-none
                transition-colors
                placeholder:text-slate-400
                focus:border-orange-500/50
                focus:ring-2
                focus:ring-orange-500/10

                dark:border-white/10
                dark:bg-black/20
                dark:text-white
                dark:placeholder:text-slate-600
              "
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          PROBLEM LIBRARY
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
              // problem library
            </p>

            <p
              className="
                mt-1.5
                text-xs
                text-slate-500
              "
            >
              Manage challenges and their supporting resources.
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
            {filteredProblems.length}{" "}
            {filteredProblems.length === 1
              ? "problem"
              : "problems"}
          </span>
        </div>

        {filteredProblems.length === 0 ? (
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
            <Code2
              size={32}
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
              {problems.length === 0
                ? "No Problems Found"
                : "No Matching Problems"}
            </h3>

            <p
              className="
                mt-1.5
                text-xs
                text-slate-500
              "
            >
              {problems.length === 0
                ? "Create your first coding challenge to get started."
                : "Try a different search term."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProblems.map((problem) => (
              <div
                key={problem.id}
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
                {/* Problem header */}

                <div
                  className="
                    flex
                    flex-col
                    gap-4
                    lg:flex-row
                    lg:items-start
                    lg:justify-between
                  "
                >
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
                      {problem.title}
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
                          ${getDifficultyColor(
                            problem.difficulty
                          )}
                        `}
                      >
                        {problem.difficulty}
                      </span>

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
                          ${
                            problem.active
                              ? `
                                border-emerald-500/20
                                bg-emerald-500/10
                                text-emerald-600
                                dark:text-emerald-400
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
                        {problem.active
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>
                  </div>

                  {/* Primary actions */}

                  <div
                    className="
                      flex
                      flex-wrap
                      gap-2
                    "
                  >
                    <Link
                      to={`/admin/problems/${problem.id}/edit`}
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
                        toggleProblem(problem)
                      }
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-md
                        border
                        border-orange-500/20
                        bg-orange-500/10
                        px-3
                        py-2
                        text-xs
                        font-medium
                        text-orange-600
                        transition-colors
                        hover:bg-orange-500/20
                        dark:text-orange-400
                      "
                    >
                      <Power size={14} />

                      {problem.active
                        ? "Deactivate"
                        : "Activate"}
                    </button>
                  </div>
                </div>

                {/* Divider */}

                <div
                  className="
                    my-5
                    border-t
                    border-slate-200
                    dark:border-white/10
                  "
                />

                {/* Secondary actions */}

                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-2
                  "
                >
                  <Link
                    to={`/admin/problems/${problem.id}/examples`}
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-md
                      border
                      border-green-500/20
                      bg-green-500/10
                      px-3
                      py-2
                      text-xs
                      font-medium
                      text-green-600
                      transition-colors
                      hover:bg-green-500/20
                      dark:text-green-400
                    "
                  >
                    <FlaskConical size={14} />
                    Examples
                  </Link>

                  <Link
                    to={`/admin/problems/${problem.id}/testcases`}
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-md
                      border
                      border-purple-500/20
                      bg-purple-500/10
                      px-3
                      py-2
                      text-xs
                      font-medium
                      text-purple-600
                      transition-colors
                      hover:bg-purple-500/20
                      dark:text-purple-400
                    "
                  >
                    <PlayCircle size={14} />
                    Test Cases
                  </Link>

                  <Link
                    to={`/admin/problems/${problem.id}/starter-codes`}
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-md
                      border
                      border-cyan-500/20
                      bg-cyan-500/10
                      px-3
                      py-2
                      text-xs
                      font-medium
                      text-cyan-600
                      transition-colors
                      hover:bg-cyan-500/20
                      dark:text-cyan-400
                    "
                  >
                    <Code2 size={14} />
                    Starter Codes
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      deleteProblem(problem.id)
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

function ProblemStat({
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
