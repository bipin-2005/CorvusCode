import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getSubmissionById,
  getSubmissionResult,
  getSubmissionTestResults,
  type Submission,
  type SubmissionResult,
  type SubmissionTestResult,
} from "../services/submission.service";

export default function SubmissionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [submission, setSubmission] =
    useState<Submission | null>(null);

  const [result, setResult] =
    useState<SubmissionResult | null>(null);

  const [testResults, setTestResults] =
    useState<SubmissionTestResult[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Invalid submission ID.");
      setLoading(false);
      return;
    }

    const loadSubmission = async () => {
      try {
        setLoading(true);
        setError("");

        const submissionId = Number(id);

        if (Number.isNaN(submissionId)) {
          throw new Error("Invalid submission ID.");
        }

        const [
          submissionData,
          resultData,
          testResultsData,
        ] = await Promise.all([
          getSubmissionById(submissionId),
          getSubmissionResult(submissionId),
          getSubmissionTestResults(submissionId),
        ]);

        setSubmission(submissionData);
        setResult(resultData);
        setTestResults(testResultsData);
      } catch (err) {
        console.error(
          "Failed to load submission:",
          err
        );

        setError(
          "Failed to load submission details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSubmission();
  }, [id]);

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div
        className="
          min-h-screen
          bg-white
          text-slate-900

          dark:bg-black/20
          dark:text-slate-200
        "
      >
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <p className="text-sm text-slate-500">
            Loading submission...
          </p>
        </div>
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (error || !submission) {
    return (
      <div
        className="
          min-h-screen
          bg-white
          text-slate-900

          dark:bg-black/20
          dark:text-slate-200
        "
      >
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">

          <p className="text-sm text-red-500 dark:text-red-400">
            {error || "Submission not found."}
          </p>

          <button
            onClick={() => navigate("/submissions")}
            className="
              mt-5
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
            ← Back to Submissions
          </button>

        </div>
      </div>
    );
  }

  /* =========================
     PAGE
  ========================= */

  return (
    <div
      className="
        min-h-screen
        bg-white
        text-slate-900

        dark:bg-black/20
        dark:text-slate-200
      "
    >

      {/* HEADER */}

      <header
        className="
          border-b
          border-slate-200

          dark:border-white/10
        "
      >

      </header>

      {/* MAIN */}

      <main className="mx-auto max-w-6xl px-6 py-10">

        {/* TITLE */}

        <div>

          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-500">
            Submission
          </p>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-4">

            <h1
              className="
                text-3xl
                font-bold
                text-slate-900

                dark:text-white
              "
            >
              Submission #{submission.id}
            </h1>

            <StatusBadge
              status={submission.status}
            />

          </div>

        </div>

        {/* SUMMARY */}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <InfoCard
            label="Problem"
            value={submission.problemTitle}
          />

          <InfoCard
            label="Language"
            value={submission.language}
          />

          <InfoCard
            label="Type"
            value={submission.type}
          />

          <InfoCard
            label="Test Cases"
            value={`${submission.passedTestCases} / ${submission.totalTestCases}`}
          />

        </div>

        {/* PERFORMANCE */}

        <div className="mt-4 grid gap-4 sm:grid-cols-2">

          <InfoCard
            label="Execution Time"
            value={
              submission.executionTime !== null
                ? `${submission.executionTime} ms`
                : "-"
            }
          />

          <InfoCard
            label="Memory"
            value={
              submission.memory !== null
                ? `${submission.memory} MB`
                : "-"
            }
          />

        </div>

        {/* SOURCE CODE */}

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

          <div
            className="
              border-b
              border-slate-200
              bg-slate-50
              px-5
              py-4

              dark:border-white/10
              dark:bg-[#111113]
            "
          >
            <h2
              className="
                text-sm
                font-semibold
                text-slate-900

                dark:text-white
              "
            >
              Source Code
            </h2>
          </div>

          <pre
            className="
              max-h-[600px]
              overflow-auto
              bg-slate-50
              p-5
              text-sm
              leading-6
              text-slate-700

              dark:bg-[#090909]
              dark:text-slate-300
            "
          >
            <code>
              {submission.sourceCode}
            </code>
          </pre>

        </section>

        {/* EXECUTION RESULT */}

        {result && (
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

            <div
              className="
                border-b
                border-slate-200
                bg-slate-50
                px-5
                py-4

                dark:border-white/10
                dark:bg-[#111113]
              "
            >
              <h2
                className="
                  text-sm
                  font-semibold
                  text-slate-900

                  dark:text-white
                "
              >
                Execution Result
              </h2>
            </div>

            <div className="grid gap-5 p-5 md:grid-cols-2">

              <OutputBlock
                title="Compile Output"
                value={result.compileOutput}
              />

              <OutputBlock
                title="Standard Output"
                value={result.standardOutput}
              />

              <OutputBlock
                title="Standard Error"
                value={result.standardError}
              />

            </div>

          </section>
        )}

        {/* TEST CASE RESULTS */}

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

          <div
            className="
              border-b
              border-slate-200
              bg-slate-50
              px-5
              py-4

              dark:border-white/10
              dark:bg-[#111113]
            "
          >
            <div className="flex items-center justify-between">

              <h2
                className="
                  text-sm
                  font-semibold
                  text-slate-900

                  dark:text-white
                "
              >
                Test Cases
              </h2>

              <span className="text-xs text-slate-500">
                {submission.passedTestCases} /{" "}
                {submission.totalTestCases} passed
              </span>

            </div>
          </div>

          <div>

            {testResults.map((test) => (

              <div
                key={test.id}
                className="
                  border-b
                  border-slate-200
                  p-5
                  last:border-b-0

                  dark:border-white/10
                "
              >

                {/* TEST HEADER */}

                <div className="flex items-center justify-between">

                  <span
                    className="
                      text-sm
                      font-medium
                      text-slate-800

                      dark:text-slate-300
                    "
                  >
                    Test Case #{test.testCaseId}
                  </span>

                  <span
                    className={
                      test.passed
                        ? "text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                        : "text-xs font-semibold text-red-600 dark:text-red-400"
                    }
                  >
                    {test.passed
                      ? "PASSED"
                      : "FAILED"}
                  </span>

                </div>

                {/* OUTPUTS */}

                <div className="mt-5 grid gap-5 md:grid-cols-2">

                  <OutputBlock
                    title="Expected Output"
                    value={test.expectedOutput}
                  />

                  <OutputBlock
                    title="Actual Output"
                    value={test.actualOutput}
                  />

                </div>

                {/* TEST PERFORMANCE */}

                <div
                  className="
                    mt-4
                    flex
                    gap-6
                    text-xs
                    text-slate-500
                  "
                >

                  <span>
                    Time:{" "}
                    {test.executionTime !== null
                      ? `${test.executionTime} ms`
                      : "-"}
                  </span>

                  <span>
                    Memory:{" "}
                    {test.memory !== null
                      ? `${test.memory} MB`
                      : "-"}
                  </span>

                </div>

              </div>

            ))}

            {testResults.length === 0 && (
              <div
                className="
                  p-8
                  text-center
                  text-sm
                  text-slate-500

                  dark:text-slate-600
                "
              >
                No test-case results available.
              </div>
            )}

          </div>

        </section>

        {/* BACK BUTTON */}

        <div className="mt-8">

          <button
            onClick={() =>
              navigate("/submissions")
            }
            className="
              rounded-lg
              border
              border-slate-300
              px-5
              py-2.5
              text-xs
              font-semibold
              text-slate-600
              transition
              hover:border-orange-500/40
              hover:text-orange-500

              dark:border-slate-700
              dark:text-slate-300
              dark:hover:border-slate-500
              dark:hover:text-white
            "
          >
            ← Back to Submissions
          </button>

        </div>

      </main>
    </div>
  );
}


/* =================================
   INFO CARD
================================= */

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        rounded-md
        border
        border-slate-200
        bg-white
        p-4

        dark:border-white/10
        dark:bg-black/20
      "
    >

      <p
        className="
          text-[10px]
          font-semibold
          uppercase
          tracking-wider
          text-slate-500

          dark:text-slate-600
        "
      >
        {label}
      </p>

      <p
        className="
          mt-2
          text-sm
          font-semibold
          text-slate-800

          dark:text-slate-300
        "
      >
        {value}
      </p>

    </div>
  );
}


/* =================================
   STATUS BADGE
================================= */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const accepted = status === "ACCEPTED";

  return (
    <span
      className={`
        rounded-md
        px-2.5
        py-1
        text-[10px]
        font-semibold
        ${
          accepted
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : "bg-red-500/10 text-red-600 dark:text-red-400"
        }
      `}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}


/* =================================
   OUTPUT BLOCK
================================= */

function OutputBlock({
  title,
  value,
}: {
  title: string;
  value: string | null;
}) {
  return (
    <div>

      <p
        className="
          mb-2
          text-xs
          font-medium
          text-slate-500
        "
      >
        {title}
      </p>

      <pre
        className="
          min-h-16
          max-h-64
          overflow-auto
          rounded-lg
          border
          border-slate-200
          bg-slate-50
          p-3
          text-xs
          leading-5
          text-slate-700

          dark:border-white/10
          dark:bg-[#090909]
          dark:text-slate-400
        "
      >
        {value || "No output"}
      </pre>

    </div>
  );
}