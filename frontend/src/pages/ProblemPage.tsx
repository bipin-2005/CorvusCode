import { useEffect, useState } from "react";

import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import CodeEditor from "../components/editor/CodeEditor";
import {
  submitSolution,
  type ProgrammingLanguage,
} from "../services/submission.service";


import {
  getProblemBySlug,
  getProblemExamples,
  getStarterCodes,
  type Problem,
  type ProblemExample,
  type StarterCode,
} from "../services/problem.service";

import { executeCode } from "../services/judgeService";

type EditorLanguage = "java" | "python" | "cpp";

function mapBackendLanguage(
  language: string
): EditorLanguage | null {
  switch (language.toUpperCase()) {
    case "JAVA":
      return "java";

    case "PYTHON":
      return "python";

    case "CPP":
    case "C++":
      return "cpp";

    default:
      return null;
  }
}

function getDifficultyLabel(
  difficulty: Problem["difficulty"]
) {
  switch (difficulty) {
    case "EASY":
      return "Easy";

    case "MEDIUM":
      return "Medium";

    case "HARD":
      return "Hard";

    default:
      return difficulty;
  }
}

function getDifficultyStyle(
  difficulty: Problem["difficulty"]
) {
  switch (difficulty) {
    case "EASY":
      return "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400";

    case "MEDIUM":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400";

    case "HARD":
      return "bg-rose-500/10 text-rose-500 dark:text-rose-400";

    default:
      return "bg-slate-500/10 text-slate-500";
  }
}

export default function ProblemPage() {

  const navigate = useNavigate();

  const { slug } = useParams();

  const [searchParams] = useSearchParams();

  const contestIdParam = searchParams.get("contestId");

  const contestId = contestIdParam
    ? Number(contestIdParam)
    : undefined;

  // =========================
  // PROBLEM STATE
  // =========================

  const [problem, setProblem] =
    useState<Problem | null>(null);

  const [examples, setExamples] =
    useState<ProblemExample[]>([]);

  const [starterCodes, setStarterCodes] =
    useState<StarterCode[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");




  // =========================
  // EDITOR STATE
  // =========================

  const [language, setLanguage] =
    useState<EditorLanguage>("java");

  const [codes, setCodes] =
    useState<Record<EditorLanguage, string>>({
      java: "",
      python: "",
      cpp: "",
    });


  const code =
    codes[language] ?? "";


  // =========================
  // JUDGE STATE
  // =========================

const [isSubmitting, setIsSubmitting] = useState(false);

const [submissionResult, setSubmissionResult] =
  useState<{
    status: string;
    passedTestCases: number;
    totalTestCases: number;
    executionTime: number;
    memory: number;
  } | null>(null);
  const [customInput, setCustomInput] =
    useState("");

  const [output, setOutput] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [executionTime, setExecutionTime] =
    useState(0);

  const [memory, setMemory] =
    useState(0);

  const [isRunning, setIsRunning] =
    useState(false);

    const [leftWidth, setLeftWidth] = useState(50);
    const [isDragging, setIsDragging] = useState(false);

    const [editorHeight, setEditorHeight] = useState(70);
    const [isVerticalDragging, setIsVerticalDragging] =
      useState(false);


  // =========================
  // LOAD PROBLEM
  // =========================

  useEffect(() => {

    if (!slug) {
      return;
    }

    const loadProblem = async () => {

      try {

        setLoading(true);

        setError("");

        const problemData =
          await getProblemBySlug(slug);

        setProblem(problemData);


        const [
          examplesData,
          starterCodesData,
        ] = await Promise.all([
          getProblemExamples(problemData.id),
          getStarterCodes(problemData.id),
        ]);


        setExamples(examplesData);

        setStarterCodes(
          starterCodesData
        );


      } catch (error) {

        console.error(
          "Failed to load problem:",
          error
        );

        setError(
          "Unable to load problem."
        );

      } finally {

        setLoading(false);

      }

    };

    loadProblem();

  }, [slug]);


  // =========================
  // LOAD STARTER CODE
  // =========================

useEffect(() => {
  if (starterCodes.length === 0) {
    return;
  }

  const updatedCodes: Record<EditorLanguage, string> = {
    java: "",
    python: "",
    cpp: "",
  };

  starterCodes.forEach((starter) => {
    const editorLanguage =
      mapBackendLanguage(starter.language);

    if (editorLanguage) {
      updatedCodes[editorLanguage] =
        starter.templateCode;
    }
  });

  setCodes(updatedCodes);


  if (updatedCodes.java) {
    setLanguage("java");
  }
}, [starterCodes]);





 //RUN
const handleRunCode = async () => {
  if (!code.trim()) {
    setStatus("ERROR");
    setOutput("Code cannot be empty.");
    return;
  }

  setIsRunning(true);
  setStatus("");
  setOutput("");
  setExecutionTime(0);
  setMemory(0);

  try {
    console.log("Sending code to Judge Service...");

    const result = await executeCode({
      language: language.toUpperCase() as "JAVA" | "PYTHON" | "CPP",
      sourceCode: code,
      stdin: customInput,
    });

    console.log("Judge result:", result);

    setStatus(result.status);

    if (result.compileOutput) {
      setOutput(result.compileOutput);
    } else if (result.stderr) {
      setOutput(result.stderr);
    } else {
      setOutput(result.stdout);
    }

    setExecutionTime(result.executionTime);
    setMemory(result.memory);

  } catch (error) {
    console.error("Judge request failed:", error);

    setStatus("ERROR");
    setOutput("Unable to connect to Judge Service.");
  } finally {
    setIsRunning(false);
  }
};
  // =========================
  // RUN CODE
  // =========================

  const handleSubmit = async () => {

    if (!code.trim()) {
      setStatus("ERROR");
      setOutput("Code cannot be empty.");
      return;
    }

    if (!problem) {
      return;
    }

    setIsSubmitting(true);
    setSubmissionResult(null);
    setOutput("");
    setStatus("");

    try {

      const result = await submitSolution({
        sourceCode: code,

        language:
          language.toUpperCase() as ProgrammingLanguage,

        type: "SUBMIT",

        problemId: problem.id,

        contestId: contestId,
      });

      setSubmissionResult({
        status: result.status,
        passedTestCases:
          result.passedTestCases,
        totalTestCases:
          result.totalTestCases,
        executionTime:
          result.executionTime,
        memory:
          result.memory,
      });

      setStatus(result.status);

    } catch (error) {

      console.error(
        "Submission failed:",
        error
      );

      setStatus("ERROR");

      setOutput(
        "Unable to submit solution."
      );

    } finally {

      setIsSubmitting(false);

    }
  };

useEffect(() => {
  const handleMouseMove = (e: MouseEvent) => {
    // LEFT-RIGHT DRAG

    if (isDragging) {
      const newWidth =
        (e.clientX / window.innerWidth) * 100;

      if (newWidth >= 25 && newWidth <= 75) {
        setLeftWidth(newWidth);
      }
    }

    // UP-DOWN DRAG

    if (isVerticalDragging) {
      const editorContainer =
        document.getElementById("editor-panel");

      if (!editorContainer) return;

      const rect =
        editorContainer.getBoundingClientRect();

      const percentage =
        ((e.clientY - rect.top) /
          rect.height) *
        100;

      if (
        percentage >= 30 &&
        percentage <= 85
      ) {
        setEditorHeight(percentage);
      }
    }
  };

const handleMouseUp = () => {
  setIsDragging(false);
  setIsVerticalDragging(false);
};

  window.addEventListener(
    "mousemove",
    handleMouseMove
  );

  window.addEventListener(
    "mouseup",
    handleMouseUp
  );

  return () => {
    window.removeEventListener(
      "mousemove",
      handleMouseMove
    );

    window.removeEventListener(
      "mouseup",
      handleMouseUp
    );
  };
}, [isDragging, isVerticalDragging]);


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
<div className="flex min-h-screen items-center justify-center bg-white text-slate-500 dark:bg-[#0a0a0b] dark:text-slate-400">
        <p className="font-mono text-sm">
          Loading problem…
        </p>

      </div>
    );

  }


  // =========================
  // ERROR
  // =========================

  if (error || !problem) {

    return (
<div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#0a0a0b]">
        <div className="text-center">

          <p className="text-sm text-rose-500 dark:text-rose-400">
            {error || "Problem not found."}
          </p>

          <button
            onClick={() =>
              navigate("/problems")
            }
className="mt-4 rounded-md border border-slate-300 px-4 py-2 text-xs text-slate-600 transition-colors hover:border-orange-500/40 hover:text-orange-500 dark:border-white/15 dark:text-slate-400 dark:hover:text-white"          >
            Back to Problems
          </button>

        </div>

      </div>
    );

  }


  // =========================
  // MAIN UI
  // =========================

  return (

<div className="min-h-screen bg-white text-slate-900 dark:bg-[#0a0a0b] dark:text-white">




      {/* ================= MAIN ================= */}

    <main className="mx-auto h-[calc(100vh-4rem)] max-w-7xl overflow-hidden">

        <div className="hidden h-full min-h-0 lg:flex">


          {/* ================= PROBLEM ================= */}
<div
  style={{ width: `${leftWidth}%` }}
  className="h-full pr-3"
>
<section
  className="
    h-full
    overflow-y-auto
    rounded-lg
    border
    border-slate-200
    bg-white
    p-6
    text-slate-900

    dark:border-white/10
    dark:bg-[#111113]
    dark:text-white
  "
>

            {/* TITLE */}

            <div className="flex items-center gap-3">

              <h1 className="font-[var(--font-display)] text-xl font-bold tracking-tight">
                {problem.title}
              </h1>


              <span
                className={`rounded px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wide ${getDifficultyStyle(
                  problem.difficulty
                )}`}
              >
                {getDifficultyLabel(
                  problem.difficulty
                )}
              </span>
              </div>

<div className="mt-6 space-y-6 text-sm leading-7 text-slate-600 dark:text-slate-400">
  <p className="whitespace-pre-wrap">
    {problem.description}
  </p>
</div>


            {/* INPUT FORMAT */}

            {problem.inputFormat && (

              <div className="mt-8">

<h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">                  Input Format
                </h2>

                <p className="mt-2.5 whitespace-pre-wrap text-xs leading-6 text-slate-500">
                  {problem.inputFormat}
                </p>

              </div>

            )}


            {/* OUTPUT FORMAT */}

            {problem.outputFormat && (

              <div className="mt-8">

                <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
                  Output Format
                </h2>

                <p className="mt-2.5 whitespace-pre-wrap text-xs leading-6 text-slate-500">
                  {problem.outputFormat}
                </p>

              </div>

            )}


            {/* EXAMPLES */}

            {examples.length > 0 && (

              <div className="mt-8">

               <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
                 Examples
               </h2>


                <div className="space-y-5">

                  {examples.map(
                    (example, index) => (

                      <div
                        key={example.id}
                        className="
                          mt-3
                          overflow-hidden
                          rounded-md
                          border
                          border-slate-200
                          bg-white

                          dark:border-white/10
                          dark:bg-black/20
                        "
                      >

                        <div className="border-b border-slate-200 px-4 py-2.5 font-mono text-[11px] font-semibold text-slate-500 dark:border-white/10 dark:text-slate-500">
                          Example {index + 1}
                        </div>


                        <div className="border-b border-slate-200 dark:border-white/10">
                          <div className="px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            Input
                          </div>

                          <pre className="whitespace-pre-wrap px-4 pb-4 font-mono text-sm text-slate-800 dark:text-slate-300">
                            {example.input}
                          </pre>
                        </div>


                      <div className="border-b border-slate-200 dark:border-white/10">
                        <p className="px-4 pt-2.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                          Output
                        </p>

                       <pre className="max-h-48 overflow-auto whitespace-pre-wrap px-4 py-3 font-mono text-xs leading-5 text-slate-800 dark:text-slate-300">
                         {output}
                       </pre>
                      </div>


                        {example.explanation && (

                          <div>
                            <div className="px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                              Explanation
                            </div>

                            <p className="whitespace-pre-wrap px-4 pb-4 text-xs leading-6 text-slate-600 dark:text-slate-400">
                              {example.explanation}
                            </p>
                          </div>

                        )}

                      </div>

                    )
                  )}

                </div>

              </div>

            )}


            {/* CONSTRAINTS */}

            {problem.constraints && (

              <div className="mt-8">

                <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
                  Constraints
                </h2>

                <p className="mt-2.5 whitespace-pre-wrap text-xs leading-6 text-slate-500">
                  {problem.constraints}
                </p>

              </div>

            )}


            {/* EXPLANATION */}

            {problem.explanation && (

              <div className="mt-8">

                <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
                  Explanation
                </h2>

                <p className="mt-2.5 whitespace-pre-wrap text-xs leading-6 text-slate-500">
                  {problem.explanation}
                </p>

              </div>

            )}

          </section>
          </div>

          <div
            onMouseDown={() => setIsDragging(true)}
            className="w-1 shrink-0 cursor-col-resize bg-slate-200 transition-colors hover:bg-orange-500 dark:bg-white/10"
          />


          {/* ================= EDITOR ================= */}

         <div
           style={{
             width: `${100 - leftWidth}%`,
           }}
           className="h-full pl-3"
         >
<section
  id="editor-panel"
  className="
    flex
    h-full
    min-h-0
    flex-col
    overflow-hidden
    rounded-lg
    border
    border-slate-200
    bg-white

    dark:border-white/10
    dark:bg-[#0d0d0f]
  "
>

            {/* EDITOR HEADER */}

<div
  className="
    flex
    h-12
    shrink-0
    items-center
    justify-between
    border-b
    border-slate-200
    bg-white
    px-4

    dark:border-white/10
    dark:bg-[#0d0d0f]
  "
>
              <div className="flex items-center gap-3">

                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
                  Code
                </span>


                <select
                  value={language}
                  onChange={(e) => {

                    setLanguage(
                      e.target.value as EditorLanguage
                    );

                  }}
className="
  rounded-md
  border
  border-slate-200
  bg-white
  px-2.5
  py-1.5
  font-mono
  text-xs
  font-medium
  text-slate-800
  outline-none
  focus:border-orange-500/40

  dark:border-white/15
  dark:bg-[#111113]
  dark:text-slate-300
"                >

                  <option value="java">
                    Java
                  </option>

                  <option value="python">
                    Python
                  </option>

                  <option value="cpp">
                    C++
                  </option>

                </select>

              </div>


              <span className="font-mono text-[10px] text-slate-500 dark:text-slate-600">
                {problem.slug}
              </span>

            </div>



            {/* MONACO */}

            <div
              style={{
                flex: editorHeight,
              }}
              className="min-h-0"
            >
              <CodeEditor
                language={language}
                value={code}
                onChange={(value) => {
                  setCodes((previous) => ({
                    ...previous,
                    [language]: value,
                  }));
                }}
              />
            </div>

            {/* RESIZE HANDLE */}

            <div
              onMouseDown={() =>
                setIsVerticalDragging(true)
              }
              className="
                h-1
                shrink-0
                cursor-row-resize
                bg-slate-200
                transition-colors
                hover:bg-orange-500
                dark:bg-white/10
              "
            />

            {/* BOTTOM PANEL */}

            <div
              style={{
                flex: 100 - editorHeight,
              }}
              className="
                min-h-0
                overflow-auto
                border-t
                border-slate-200
                p-4
                dark:border-white/10
              "
            >





              {/* OUTPUT */}

              {status && (

<div
  className="
    mb-4
    overflow-hidden
    rounded-md
    border
    border-slate-200
    bg-white

    dark:border-white/10
    dark:bg-black/20
  "
>

                  <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2.5 dark:border-white/10">

                    <p className="font-mono text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Output
                    </p>


                    <span
                      className={`font-mono text-[10px] font-bold ${
                        status === "ACCEPTED" ||
                        status === "SUCCESS"
                          ? "text-emerald-500 dark:text-emerald-400"
                          : status === "TIME_LIMIT_EXCEEDED"
                          ? "text-amber-500 dark:text-amber-400"
                          : status === "MEMORY_LIMIT_EXCEEDED"
                          ? "text-orange-500 dark:text-orange-400"
                          : "text-rose-500 dark:text-rose-400"
                      }`}
                    >
                      {status}
                    </span>

                  </div>


                  <pre className="max-h-48 overflow-auto whitespace-pre-wrap px-4 py-4 font-mono text-xs leading-5 text-slate-700 dark:text-slate-300">
                    {output}
                  </pre>


                  <div className="flex gap-6 border-t border-slate-200 px-4 py-3 dark:border-white/10">

                    <div>

                      <p className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-600">
                        Execution Time
                      </p>

                      <p className="mt-1 font-mono text-xs text-slate-700 dark:text-slate-400">
                        {executionTime} ms
                      </p>

                    </div>


                    <div>

                      <p className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-600">
                        Memory
                      </p>

                      <p className="mt-1 font-mono text-xs text-slate-700 dark:text-slate-400">
                        {memory} MB
                      </p>

                    </div>

                  </div>

                </div>

              )}

{submissionResult && (
  <div className="mb-4 overflow-hidden rounded-md border border-slate-200 bg-white dark:border-white/10 dark:bg-black/20">

    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2.5 dark:border-white/10">

      <p className="font-mono text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Submission Result
      </p>

      <span
        className={`font-mono text-[10px] font-bold ${
          status === "ACCEPTED" ||
          status === "SUCCESS"
            ? "text-emerald-500 dark:text-emerald-400"
            : status === "TIME_LIMIT_EXCEEDED"
            ? "text-amber-500 dark:text-amber-400"
            : status === "MEMORY_LIMIT_EXCEEDED"
            ? "text-orange-500 dark:text-orange-400"
            : "text-rose-500 dark:text-rose-400"
        }`}
      >
        {status}
      </span>

    </div>

    <div className="grid grid-cols-3 gap-4 px-4 py-4">

      <div>
        <p className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-600">
          Test Cases
        </p>

        <p className="mt-1 font-mono text-xs text-slate-700 dark:text-slate-300">
          {submissionResult.passedTestCases}
          {" / "}
          {submissionResult.totalTestCases}
        </p>
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-600">
          Execution Time
        </p>

        <p className="mt-1 font-mono text-xs text-slate-700 dark:text-slate-300">
          {submissionResult.executionTime} ms
        </p>
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-600">
          Memory
        </p>

        <p className="mt-1 font-mono text-xs text-slate-700 dark:text-slate-300">
          {submissionResult.memory} MB
        </p>
      </div>

    </div>

  </div>

)}
              {/* CUSTOM INPUT */}

              <div className="mb-4">

                <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Custom Input
                </p>


                <textarea
                  value={customInput}
                  onChange={(e) =>
                    setCustomInput(e.target.value)
                  }
                  placeholder="Enter input..."
                  className="
                    h-20
                    w-full
                    resize-none
                    rounded-md
                    border
                    border-slate-200
                    bg-white
                    p-3
                    font-mono
                    text-xs
                    text-slate-900
                    outline-none
                    placeholder:text-slate-400
                    focus:border-orange-500/40

                    dark:border-white/15
                    dark:bg-black/20
                    dark:text-slate-300
                    dark:placeholder:text-slate-700
                  "
                />

              </div>


              {/* BUTTONS */}

              <div className="flex justify-end gap-3">

                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="rounded-md border border-slate-300 px-5 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-400 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/15 dark:text-slate-300 dark:hover:border-white/30 dark:hover:text-white"
                >
                  {isRunning
                    ? "Running…"
                    : "Run Code"}
                </button>


                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || isRunning}
                  className="rounded-md bg-orange-500 px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting…" : "Submit"}
                </button>

              </div>

            </div>

         </section>
         </div>

         </div>

         </main>

    </div>
  );
}