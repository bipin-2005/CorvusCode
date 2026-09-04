import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileCode } from "lucide-react";

import {
  getMySubmissions,
  type Submission,
  type SubmissionStatus,
} from "../services/submission.service";

export default function SubmissionsPage() {
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<SubmissionStatus | "ALL">("ALL");

  const [languageFilter, setLanguageFilter] =
    useState<Submission["language"] | "ALL">("ALL");

  const [typeFilter, setTypeFilter] =
    useState<Submission["type"] | "ALL">("ALL");

  const [sortOrder, setSortOrder] =
    useState<"NEWEST" | "OLDEST">("NEWEST");

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        setLoading(true);

        const data = await getMySubmissions();

        setSubmissions(data);
      } catch (err) {
        console.error(
          "Failed to load submissions:",
          err
        );
        setError("Failed to load submissions.");
      } finally {
        setLoading(false);
      }
    };

    loadSubmissions();
  }, []);

  const filteredSubmissions = [...submissions]
    .filter((submission) => {
      if (
        statusFilter !== "ALL" &&
        submission.status !== statusFilter
      ) {
        return false;
      }

      if (
        languageFilter !== "ALL" &&
        submission.language !== languageFilter
      ) {
        return false;
      }

      if (
        typeFilter !== "ALL" &&
        submission.type !== typeFilter
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(
        a.submittedAt
      ).getTime();

      const dateB = new Date(
        b.submittedAt
      ).getTime();

      return sortOrder === "NEWEST"
        ? dateB - dateA
        : dateA - dateB;
    });

  const clearFilters = () => {
    setStatusFilter("ALL");
    setLanguageFilter("ALL");
    setTypeFilter("ALL");
    setSortOrder("NEWEST");
  };

  return (
    <div>

      {/* ================================================= */}
      {/* PAGE HEADER */}
      {/* ================================================= */}

      <section
        className="
          mb-8
          flex
          flex-col
          gap-4
          rounded-lg
          border
          border-slate-200
          bg-white
          p-6
          lg:flex-row
          lg:items-center
          lg:justify-between

          dark:border-white/10
          dark:bg-[#111113]
        "
      >
        <div>

          <p className="mb-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-500">
            // activity
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
            <FileCode className="h-8 w-8 text-orange-500" />
            Submission
          </h1>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            View your coding submissions, execution results, and test case
            performance.
          </p>

        </div>

        {!loading &&
          !error &&
          submissions.length > 0 && (
            <div
              className="
                rounded-md
                border
                border-orange-500/20
                bg-orange-500/5
                px-5
                py-3
              "
            >
              <p className="text-xs text-slate-500">
                Total Results
              </p>

              <p className="mt-1 text-2xl font-bold text-orange-500 dark:text-orange-400">
                {filteredSubmissions.length}
              </p>
            </div>
          )}
      </section>

      {/* ================================================= */}
      {/* FILTERS */}
      {/* ================================================= */}

      {!loading &&
        !error &&
        submissions.length > 0 && (
          <section
            className="
              mt-5
              rounded-lg
              border
              border-slate-200
              bg-white

              dark:border-white/10
              dark:bg-black/20
            "
          >
            <div className="p-5">

              {/* Filter Header */}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                    // filter submissions
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Narrow down submissions by status, language, or type.
                  </p>

                </div>

                <button
                  onClick={clearFilters}
                  className="
                    w-fit
                    text-xs
                    font-medium
                    text-slate-600
                    transition
                    hover:text-orange-500

                    dark:text-slate-300
                    dark:hover:text-white
                  "
                >
                  Clear filters
                </button>

              </div>

              {/* Filter Controls */}

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                {/* Status */}

                <FilterSelect
                  label="Status"
                  value={statusFilter}
                  onChange={(value) =>
                    setStatusFilter(
                      value as
                        | SubmissionStatus
                        | "ALL"
                    )
                  }
                  options={[
                    {
                      value: "ALL",
                      label: "All statuses",
                    },
                    {
                      value: "ACCEPTED",
                      label: "Accepted",
                    },
                    {
                      value: "WRONG_ANSWER",
                      label: "Wrong Answer",
                    },
                    {
                      value: "COMPILATION_ERROR",
                      label: "Compilation Error",
                    },
                    {
                      value: "RUNTIME_ERROR",
                      label: "Runtime Error",
                    },
                    {
                      value: "TIME_LIMIT_EXCEEDED",
                      label: "Time Limit Exceeded",
                    },
                    {
                      value: "MEMORY_LIMIT_EXCEEDED",
                      label: "Memory Limit Exceeded",
                    },
                    {
                      value: "PENDING",
                      label: "Pending",
                    },
                    {
                      value: "RUNNING",
                      label: "Running",
                    },
                  ]}
                />

                {/* Language */}

                <FilterSelect
                  label="Language"
                  value={languageFilter}
                  onChange={(value) =>
                    setLanguageFilter(
                      value as
                        | Submission["language"]
                        | "ALL"
                    )
                  }
                  options={[
                    {
                      value: "ALL",
                      label: "All languages",
                    },
                    {
                      value: "JAVA",
                      label: "Java",
                    },
                    {
                      value: "PYTHON",
                      label: "Python",
                    },
                    {
                      value: "CPP",
                      label: "C++",
                    },
                    {
                      value: "JAVASCRIPT",
                      label: "JavaScript",
                    },
                    {
                      value: "C",
                      label: "C",
                    },
                    {
                      value: "CSHARP",
                      label: "C#",
                    },
                    {
                      value: "GO",
                      label: "Go",
                    },
                    {
                      value: "KOTLIN",
                      label: "Kotlin",
                    },
                    {
                      value: "SWIFT",
                      label: "Swift",
                    },
                    {
                      value: "RUST",
                      label: "Rust",
                    },
                  ]}
                />

                {/* Type */}

                <FilterSelect
                  label="Type"
                  value={typeFilter}
                  onChange={(value) =>
                    setTypeFilter(
                      value as
                        | Submission["type"]
                        | "ALL"
                    )
                  }
                  options={[
                    {
                      value: "ALL",
                      label: "All types",
                    },
                    {
                      value: "SUBMIT",
                      label: "Submit",
                    },
                    {
                      value: "RUN",
                      label: "Run",
                    },
                  ]}
                />

                {/* Sort */}

                <FilterSelect
                  label="Sort"
                  value={sortOrder}
                  onChange={(value) =>
                    setSortOrder(
                      value as
                        | "NEWEST"
                        | "OLDEST"
                    )
                  }
                  options={[
                    {
                      value: "NEWEST",
                      label: "Newest first",
                    },
                    {
                      value: "OLDEST",
                      label: "Oldest first",
                    },
                  ]}
                />

              </div>

              {/* Result Count */}

              <div
                className="
                  mt-5
                  border-t
                  border-slate-200
                  pt-4
                  text-xs
                  text-slate-500

                  dark:border-white/10
                  dark:text-slate-600
                "
              >
                Showing{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-400">
                  {filteredSubmissions.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-400">
                  {submissions.length}
                </span>{" "}
                submissions
              </div>

            </div>
          </section>
        )}

      {/* ================================================= */}
      {/* LOADING */}
      {/* ================================================= */}

      {loading && (
        <div
          className="
            mt-5
            rounded-lg
            border
            border-slate-200
            bg-white
            px-6
            py-20
            text-center

            dark:border-white/10
            dark:bg-black/20
          "
        >
          <p className="text-sm text-slate-500">
            Loading submissions...
          </p>
        </div>
      )}

      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {!loading && error && (
        <div
          className="
            mt-5
            rounded-lg
            border
            border-red-500/20
            bg-red-500/5
            px-6
            py-20
            text-center
          "
        >
          <p className="text-sm text-red-500 dark:text-red-400">
            {error}
          </p>
        </div>
      )}

      {/* ================================================= */}
      {/* NO SUBMISSIONS */}
      {/* ================================================= */}

      {!loading &&
        !error &&
        submissions.length === 0 && (
          <div
            className="
              mt-5
              rounded-lg
              border
              border-slate-200
              bg-white
              px-6
              py-20
              text-center

              dark:border-white/10
              dark:bg-black/20
            "
          >
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              No submissions yet
            </p>

            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-500 dark:text-slate-600">
              Submit a solution to one of the coding problems
              and your submission history will appear here.
            </p>

            <button
              onClick={() =>
                navigate("/problems")
              }
              className="
                mt-6
                rounded-lg
                bg-orange-500
                px-4
                py-2
                text-xs
                font-semibold
                text-white
                transition
                hover:bg-orange-400
              "
            >
              Browse Problems
            </button>
          </div>
        )}

      {/* ================================================= */}
      {/* NO FILTER RESULTS */}
      {/* ================================================= */}

      {!loading &&
        !error &&
        submissions.length > 0 &&
        filteredSubmissions.length === 0 && (
          <div
            className="
              mt-5
              rounded-lg
              border
              border-slate-200
              bg-white
              px-6
              py-20
              text-center

              dark:border-white/10
              dark:bg-black/20
            "
          >
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              No matching submissions
            </p>

            <p className="mt-2 text-xs text-slate-500 dark:text-slate-600">
              Try changing or clearing your filters.
            </p>

            <button
              onClick={clearFilters}
              className="
                mt-5
                rounded-lg
                border
                border-slate-300
                px-4
                py-2
                text-xs
                font-medium
                text-slate-600
                transition
                hover:border-orange-500/40
                hover:text-orange-500

                dark:border-white/10
                dark:text-slate-500
                dark:hover:border-slate-700
                dark:hover:text-white
              "
            >
              Clear Filters
            </button>
          </div>
        )}

      {/* ================================================= */}
      {/* SUBMISSIONS TABLE */}
      {/* ================================================= */}

      {!loading &&
        !error &&
        submissions.length > 0 &&
        filteredSubmissions.length > 0 && (
          <section
            className="
              mt-8
              overflow-hidden
              rounded-lg
              border
              border-slate-200
              bg-white

              dark:border-white/10
              dark:bg-black/20
            "
          >

            {/* Table Header */}

            <div
              className="
                hidden
                grid-cols-[70px_minmax(0,1fr)_110px_170px_120px]
                gap-4
                border-b
                border-slate-200
                bg-white
                px-5
                py-3.5
                text-[10px]
                font-semibold
                uppercase
                tracking-wider
                text-slate-500
                md:grid

                dark:border-white/10
                dark:bg-black/20
                dark:text-slate-400
              "
            >
              <span>ID</span>
              <span>Problem</span>
              <span>Language</span>
              <span>Status</span>
              <span>Submitted</span>
            </div>

            {/* Rows */}

            <div>
              {filteredSubmissions.map(
                (submission) => (
                  <SubmissionRow
                    key={submission.id}
                    submission={submission}
                    onClick={() =>
                      navigate(
                        `/submissions/${submission.id}`
                      )
                    }
                  />
                )
              )}
            </div>

          </section>
        )}
    </div>
  );
}


/* =========================================================
   Submission Row
========================================================= */

function SubmissionRow({
  submission,
  onClick,
}: {
  submission: Submission;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="
        group
        grid
        w-full
        grid-cols-1
        gap-4
        border-b
        border-slate-200
        bg-white
        px-5
        py-4
        text-left
        transition
        last:border-b-0
        hover:bg-orange-50

        dark:border-white/10
        dark:bg-black/20
        dark:hover:bg-white/[0.02]

        md:grid-cols-[70px_minmax(0,1fr)_110px_170px_120px]
        md:items-center
        md:gap-4
      "
    >

      {/* ID */}

      <div className="flex items-center justify-between md:block">

        <span
          className="
            text-[10px]
            font-semibold
            uppercase
            tracking-wider
            text-slate-500
            md:hidden

            dark:text-slate-700
          "
        >
          ID
        </span>

        <span className="text-xs font-medium text-slate-500 dark:text-slate-600">
          #{submission.id}
        </span>

      </div>

      {/* Problem */}

      <div className="min-w-0">

        <div className="flex items-start justify-between gap-4">

          <div className="min-w-0">

            <p
              className="
                truncate
                text-sm
                font-semibold
                text-slate-800
                transition
                group-hover:text-orange-500

                dark:text-slate-200
                dark:group-hover:text-white
              "
            >
              {submission.problemTitle}
            </p>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-600">
              {submission.passedTestCases ?? 0}
              {" / "}
              {submission.totalTestCases ?? 0}
              {" test cases passed"}
            </p>

          </div>

          {/* Mobile Status */}

          <div className="md:hidden">
            <StatusBadge
              status={submission.status}
            />
          </div>

        </div>

      </div>

      {/* Language */}

      <div className="flex items-center justify-between md:block">

        <span
          className="
            text-[10px]
            font-semibold
            uppercase
            tracking-wider
            text-slate-500
            md:hidden

            dark:text-slate-700
          "
        >
          Language
        </span>

        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
          {submission.language}
        </span>

      </div>

      {/* Status */}

      <div className="hidden md:block">
        <StatusBadge
          status={submission.status}
        />
      </div>

      {/* Date */}

      <div className="flex items-center justify-between md:block">

        <span
          className="
            text-[10px]
            font-semibold
            uppercase
            tracking-wider
            text-slate-500
            md:hidden

            dark:text-slate-700
          "
        >
          Submitted
        </span>

        <span className="text-xs text-slate-500 dark:text-slate-600">
          {formatDate(
            submission.submittedAt
          )}
        </span>

      </div>

    </button>
  );
}


/* =========================================================
   Status Badge
========================================================= */

function StatusBadge({
  status,
}: {
  status: SubmissionStatus;
}) {
  const styles: Record<string, string> = {
    ACCEPTED:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",

    WRONG_ANSWER:
      "bg-red-500/10 text-red-600 dark:text-red-400",

    RUNTIME_ERROR:
      "bg-red-500/10 text-red-600 dark:text-red-400",

    COMPILATION_ERROR:
      "bg-red-500/10 text-red-600 dark:text-red-400",

    TIME_LIMIT_EXCEEDED:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400",

    MEMORY_LIMIT_EXCEEDED:
      "bg-orange-500/10 text-orange-600 dark:text-orange-400",

    PENDING:
      "bg-slate-500/10 text-slate-600 dark:text-slate-400",

    RUNNING:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  };

  return (
    <span
      className={`
        w-fit
        rounded-md
        px-2.5
        py-1
        text-[10px]
        font-semibold
        ${styles[status] ?? "bg-slate-500/10 text-slate-600 dark:text-slate-400"}
      `}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}


/* =========================================================
   Date Formatter
========================================================= */

function formatDate(date: string) {
  if (!date) {
    return "-";
  }

  return new Date(date).toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}


/* =========================================================
   Filter Select
========================================================= */

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">

      <label
        className="
          text-[10px]
          font-semibold
          uppercase
          tracking-wider
          text-slate-600

          dark:text-slate-300
        "
      >
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="
          h-10
          w-full
          rounded-lg
          border
          border-slate-300
          bg-white
          px-3
          text-xs
          font-medium
          text-slate-700
          outline-none
          transition
          focus:border-orange-500/50

          dark:border-white/10
          dark:bg-black/20
          dark:text-slate-400
        "
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

    </div>
  );
}