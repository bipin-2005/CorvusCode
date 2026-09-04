import { useEffect, useState } from "react";

import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import CodeEditor from "../components/editor/CodeEditor";

import {
  getContestById,
} from "../services/contest.service";

import {
  getContestProblems,
  type ContestProblem,
} from "../services/contestProblem.service";

import {
  getProblemById,
  getProblemExamples,
  getStarterCodes,
  type Problem,
  type ProblemExample,
  type StarterCode,
} from "../services/problem.service";

import {
  submitSolution,
  type ProgrammingLanguage,
} from "../services/submission.service";

import {
  executeCode,
} from "../services/judgeService";

import {
  ArrowLeft,
  Clock,
  Trophy,
  Play,
  Send,
} from "lucide-react";


type EditorLanguage =
  | "java"
  | "python"
  | "cpp";


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
      return `
        bg-emerald-500/10
        text-emerald-600
        dark:text-emerald-400
      `;

    case "MEDIUM":
      return `
        bg-orange-500/10
        text-orange-600
        dark:text-orange-400
      `;

    case "HARD":
      return `
        bg-red-500/10
        text-red-600
        dark:text-red-400
      `;

    default:
      return `
        bg-slate-100
        text-slate-500
        dark:bg-slate-800
        dark:text-slate-400
      `;
  }
}


function getStatusStyle(status: string) {

  switch (status) {

    case "ACCEPTED":
    case "SUCCESS":

      return `
        bg-emerald-500/10
        text-emerald-600
        dark:text-emerald-400
      `;

    case "TIME_LIMIT_EXCEEDED":

      return `
        bg-orange-500/10
        text-orange-600
        dark:text-orange-400
      `;

    case "COMPILATION_ERROR":
    case "RUNTIME_ERROR":
    case "WRONG_ANSWER":
    case "ERROR":

      return `
        bg-red-500/10
        text-red-600
        dark:text-red-400
      `;

    default:

      return `
        bg-slate-100
        text-slate-500
        dark:bg-slate-800
        dark:text-slate-400
      `;
  }
}


export default function ContestWorkspacePage() {

  const navigate = useNavigate();

  const { id } = useParams();

  const [searchParams] =
    useSearchParams();

  const problemIdParam =
    searchParams.get("problemId");

  const problemId = problemIdParam
    ? Number(problemIdParam)
    : undefined;


  /* =========================================
     CONTEST
  ========================================= */

  const [contest, setContest] =
    useState<any>(null);

  const [contestProblems, setContestProblems] =
    useState<ContestProblem[]>([]);


  /* =========================================
     PROBLEM
  ========================================= */

  const [problem, setProblem] =
    useState<Problem | null>(null);

  const [examples, setExamples] =
    useState<ProblemExample[]>([]);

  const [starterCodes, setStarterCodes] =
    useState<StarterCode[]>([]);


  /* =========================================
     UI STATE
  ========================================= */

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [leftWidth, setLeftWidth] =
    useState(50);

  const [isDragging, setIsDragging] =
    useState(false);

  const [editorHeight, setEditorHeight] =
    useState(70);

  const [isVerticalDragging, setIsVerticalDragging] =
    useState(false);


  /* =========================================
     EDITOR
  ========================================= */

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


  /* =========================================
     JUDGE
  ========================================= */

  const [isRunning, setIsRunning] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

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

  const [submissionResult, setSubmissionResult] =
    useState<{
      status: string;
      passedTestCases: number;
      totalTestCases: number;
      executionTime: number;
      memory: number;
    } | null>(null);


  /* =========================================
     LOAD WORKSPACE
  ========================================= */

  useEffect(() => {

    if (!id) {

      setError(
        "Contest ID is missing."
      );

      setLoading(false);

      return;
    }


    const loadWorkspace = async () => {

      try {

        setLoading(true);
        setError("");

        const contestId =
          Number(id);

        if (Number.isNaN(contestId)) {

          setError(
            "Invalid contest ID."
          );

          return;
        }


        /*
         * Enter Contest can open:
         *
         * /contests/10/workspace
         *
         * without a problemId.
         *
         * Therefore we load the contest problems first.
         */

        const [
          contestData,
          contestProblemsData,
        ] = await Promise.all([

          getContestById(
            contestId
          ),

          getContestProblems(
            contestId
          ),

        ]);


        setContest(
          contestData
        );

        setContestProblems(
          contestProblemsData ?? []
        );


        /*
         * If the URL contains:
         *
         * ?problemId=25
         *
         * use that problem.
         *
         * Otherwise select the first
         * problem in the contest.
         */

        const firstContestProblem =
          contestProblemsData?.[0] as
            (ContestProblem & {
              problemId?: number;

              problem?: {
                id?: number;
              };
            }) | undefined;


        const selectedProblemId =
          problemId ??
          firstContestProblem?.problemId ??
          firstContestProblem?.problem?.id;


        if (!selectedProblemId) {

          setError(
            "This contest does not have any problems yet."
          );

          return;
        }


        /*
         * Load the selected problem.
         */

        const problemData =
          await getProblemById(
            selectedProblemId
          );


        setProblem(
          problemData
        );


        /*
         * Load examples and starter code.
         */

        const [
          examplesData,
          starterCodesData,
        ] = await Promise.all([

          getProblemExamples(
            problemData.id
          ),

          getStarterCodes(
            problemData.id
          ),

        ]);


        setExamples(
          examplesData ?? []
        );

        setStarterCodes(
          starterCodesData ?? []
        );

      } catch (error: any) {

        console.error(
          "Failed to load contest workspace:",
          error
        );


        const backendMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error;


        setError(
          backendMessage ||
          "Unable to load contest workspace."
        );

      } finally {

        setLoading(false);
      }
    };


    loadWorkspace();

  }, [id, problemId]);


  /* =========================================
     LOAD STARTER CODE
  ========================================= */

  useEffect(() => {

    if (
      starterCodes.length === 0
    ) {
      return;
    }


    const updatedCodes:
      Record<EditorLanguage, string> = {
        java: "",
        python: "",
        cpp: "",
      };


    starterCodes.forEach(
      (starter) => {

        const editorLanguage =
          mapBackendLanguage(
            starter.language
          );


        if (editorLanguage) {

          updatedCodes[
            editorLanguage
          ] =
            starter.templateCode;
        }

      }
    );


    setCodes(
      updatedCodes
    );


    if (updatedCodes.java) {
      setLanguage("java");
    }

  }, [starterCodes]);


  /* =========================================
     RUN CODE
  ========================================= */

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
    setSubmissionResult(null);

    try {
      const result = await executeCode({
        language: (
          language.toUpperCase() as
            "JAVA" | "PYTHON" | "CPP"
        ),
        sourceCode: code,
        stdin: customInput,
      });

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
      console.error(
        "Judge request failed:",
        error
      );

      setStatus("ERROR");
      setOutput(
        "Unable to connect to Judge Service."
      );
    } finally {
      setIsRunning(false);
    }
  };


  /* =========================================
     SUBMIT
  ========================================= */

  const handleSubmit = async () => {

    /*
     * Problem must be loaded.
     */

    if (!problem) {

      setStatus("ERROR");

      setOutput(
        "Problem is not loaded."
      );

      return;
    }


    /*
     * Code cannot be empty.
     */

    if (!code.trim()) {

      setStatus("ERROR");

      setOutput(
        "Code cannot be empty."
      );

      return;
    }


    /*
     * Make sure a supported language
     * is selected.
     */

    if (
      ![
        "java",
        "python",
        "cpp",
      ].includes(language)
    ) {

      setStatus("ERROR");

      setOutput(
        "Please select a valid programming language."
      );

      return;
    }


    /*
     * Prevent duplicate submissions.
     */

    if (
      isSubmitting ||
      isRunning
    ) {

      return;
    }


    setIsSubmitting(
      true
    );

    setSubmissionResult(
      null
    );

    setOutput(
      ""
    );

    setStatus(
      ""
    );


    try {

      const result =
        await submitSolution({

          sourceCode:
            code,

          language:
            language.toUpperCase() as
              ProgrammingLanguage,

          type:
            "SUBMIT",

          problemId:
            problem.id,

          contestId:
            id
              ? Number(id)
              : undefined,

        });


      /*
       * Save submission result.
       */

      setSubmissionResult({

        status:
          result.status,

        passedTestCases:
          result.passedTestCases,

        totalTestCases:
          result.totalTestCases,

        executionTime:
          result.executionTime,

        memory:
          result.memory,

      });


      setStatus(
        result.status
      );


      /*
       * Show a useful message
       * for accepted submissions.
       */

      if (
        result.status ===
          "ACCEPTED" ||
        result.status ===
          "SUCCESS"
      ) {

        setOutput(
          "All test cases passed."
        );
      }


    } catch (error: any) {

      console.error(
        "Submission failed:",
        error
      );


      setStatus(
        "ERROR"
      );


      /*
       * IMPORTANT:
       *
       * Do not hide the backend error.
       */

      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data ||
        error?.message ||
        "Unable to submit solution.";


      setOutput(

        typeof backendMessage ===
          "string"

          ? backendMessage

          : "Unable to submit solution."

      );


    } finally {

      setIsSubmitting(
        false
      );
    }
  };

  /* =========================================
     RESIZING
  ========================================= */

  useEffect(() => {

    const handleMouseMove =
      (event: MouseEvent) => {

        if (isDragging) {

          const newWidth =
            (event.clientX /
              window.innerWidth) *
            100;


          if (
            newWidth >= 30 &&
            newWidth <= 70
          ) {

            setLeftWidth(
              newWidth
            );
          }
        }


        if (isVerticalDragging) {

          const editorPanel =
            document.getElementById(
              "editor-panel"
            );


          if (!editorPanel) {
            return;
          }


          const rect =
            editorPanel.getBoundingClientRect();


          const percentage =
            ((event.clientY -
              rect.top) /
              rect.height) *
            100;


          if (
            percentage >= 30 &&
            percentage <= 85
          ) {

            setEditorHeight(
              percentage
            );
          }
        }
      };


    const handleMouseUp =
      () => {

        setIsDragging(false);

        setIsVerticalDragging(
          false
        );
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

  }, [
    isDragging,
    isVerticalDragging,
  ]);


  /* =========================================
     LOADING
  ========================================= */

  if (loading) {

    return (

<div
  className="
    min-h-[100dvh]
    bg-white
    text-slate-900
    dark:bg-[#020617]
    dark:text-white
  "
>

        <div className="text-center">

          <div
            className="
              mx-auto
              h-10
              w-10
              animate-spin
              rounded-full
              border-2
              border-slate-200
              border-t-orange-500
              dark:border-slate-700
              dark:border-t-orange-500
            "
          />

          <p
            className="
              mt-4
              text-sm
              text-slate-500
            "
          >
            Loading workspace...
          </p>

        </div>

      </div>
    );
  }


  /* =========================================
     ERROR
  ========================================= */

  if (
    error ||
    !problem ||
    !contest
  ) {

    return (

      <div
        className="
          flex
          min-h-[calc(100vh-4rem)]
          items-center
          justify-center
          bg-white
          dark:bg-[#020617]
        "
      >

        <div className="text-center">

          <p
            className="
              text-sm
              text-red-500
            "
          >
            {error ||
              "Unable to load workspace."}
          </p>


          <button
            onClick={() =>
              navigate(
                `/contests/${id}`
              )
            }
            className="
              mt-5
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-5
              py-3
              text-sm
              font-medium
              text-slate-600
              transition
              hover:border-orange-400
              hover:text-orange-500
              dark:border-slate-800
              dark:bg-slate-950
              dark:text-slate-400
              dark:hover:text-orange-400
            "
          >

            <ArrowLeft size={16} />

            Back to Contest

          </button>

        </div>

      </div>
    );
  }


  /* =========================================
     MAIN UI
  ========================================= */

  return (

    <div
      className="
        min-h-[calc(100vh-4rem)]
        bg-white
        text-slate-900
        dark:bg-[#020617]
        dark:text-white
      "
    >

  <main
    className="
      mx-auto
      h-[100dvh]
      max-w-[1800px]
      overflow-hidden
      px-4
      py-4
    "
  >

        <div
          className="
            hidden
            h-full
            min-h-0
            lg:flex
          "
        >

          {/* =================================
              LEFT PROBLEM PANEL
          ================================= */}

          <div
            style={{
              width:
                `${leftWidth}%`,
            }}
            className="
              h-full
              pr-3
            "
          >

            <section
              className="
                h-full
                overflow-y-auto
                rounded-2xl
                border
                border-slate-200
                bg-white
                dark:border-slate-800
                dark:bg-slate-950
              "
            >

              <div className="p-6">

                {/* BACK */}

                <button
                  onClick={() =>
                    navigate(
                      `/contests/${id}`
                    )
                  }
                  className="
                    mb-6
                    inline-flex
                    items-center
                    gap-2
                    text-xs
                    font-medium
                    text-slate-500
                    transition
                    hover:text-orange-500
                  "
                >

                  <ArrowLeft
                    size={15}
                  />

                  Back to contest

                </button>


                {/* HEADER */}

                <div
                  className="
                    flex
                    flex-col
                    gap-4
                    border-b
                    border-slate-200
                    pb-6
                    dark:border-slate-800
                    md:flex-row
                    md:items-start
                    md:justify-between
                  "
                >

                  <div>

                    <div
                      className="
                        mb-2
                        flex
                        items-center
                        gap-2
                        text-xs
                        font-semibold
                        uppercase
                        tracking-[0.2em]
                        text-orange-500
                      "
                    >

                      <Trophy
                        size={13}
                      />

                      Contest

                    </div>


                    <h1
                      className="
                        text-2xl
                        font-bold
                        text-slate-900
                        dark:text-white
                      "
                    >
                      {problem.title}
                    </h1>


                    <p
                      className="
                        mt-2
                        text-xs
                        text-slate-500
                      "
                    >
                      {contest.title}
                    </p>

                  </div>


                  <span
                    className={`
                      inline-flex
                      w-fit
                      rounded-full
                      px-4
                      py-2
                      text-xs
                      font-semibold
                      ${getDifficultyStyle(
                        problem.difficulty
                      )}
                    `}
                  >
                    {getDifficultyLabel(
                      problem.difficulty
                    )}
                  </span>

                </div>


                {/* PROBLEM DESCRIPTION */}

                <div
                  className="
                    mt-7
                    space-y-8
                  "
                >

                  {/* DESCRIPTION */}

                  <div>

                    <h2
                      className="
                        text-sm
                        font-semibold
                        text-slate-900
                        dark:text-white
                      "
                    >
                      Problem Description
                    </h2>

                    <p
                      className="
                        mt-3
                        whitespace-pre-wrap
                        text-sm
                        leading-7
                        text-slate-600
                        dark:text-slate-400
                      "
                    >
                      {problem.description}
                    </p>

                  </div>


                  {/* INPUT */}

                  {problem.inputFormat && (

                    <div>

                      <h2
                        className="
                          text-sm
                          font-semibold
                          text-slate-900
                          dark:text-white
                        "
                      >
                        Input Format
                      </h2>

                      <div
                        className="
                          mt-3
                          rounded-xl
                          border
                          border-slate-200
                          bg-slate-50
                          p-4
                          dark:border-slate-800
                          dark:bg-slate-900/50
                        "
                      >

                        <p
                          className="
                            whitespace-pre-wrap
                            text-xs
                            leading-6
                            text-slate-500
                            dark:text-slate-400
                          "
                        >
                          {problem.inputFormat}
                        </p>

                      </div>

                    </div>
                  )}


                  {/* OUTPUT */}

                  {problem.outputFormat && (

                    <div>

                      <h2
                        className="
                          text-sm
                          font-semibold
                          text-slate-900
                          dark:text-white
                        "
                      >
                        Output Format
                      </h2>

                      <div
                        className="
                          mt-3
                          rounded-xl
                          border
                          border-slate-200
                          bg-slate-50
                          p-4
                          dark:border-slate-800
                          dark:bg-slate-900/50
                        "
                      >

                        <p
                          className="
                            whitespace-pre-wrap
                            text-xs
                            leading-6
                            text-slate-500
                            dark:text-slate-400
                          "
                        >
                          {problem.outputFormat}
                        </p>

                      </div>

                    </div>
                  )}


                  {/* EXAMPLES */}

                  {examples.length > 0 && (

                    <div>

                      <h2
                        className="
                          text-sm
                          font-semibold
                          text-slate-900
                          dark:text-white
                        "
                      >
                        Examples
                      </h2>


                      <div
                        className="
                          mt-4
                          space-y-4
                        "
                      >

                        {examples.map(
                          (example, index) => (

                            <div
                              key={
                                example.id
                              }
                              className="
                                overflow-hidden
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                dark:border-slate-800
                                dark:bg-slate-900/50
                              "
                            >

                              <div
                                className="
                                  border-b
                                  border-slate-200
                                  px-4
                                  py-3
                                  text-xs
                                  font-medium
                                  text-slate-500
                                  dark:border-slate-800
                                "
                              >
                                Example {index + 1}
                              </div>


                              <div
                                className="
                                  border-b
                                  border-slate-200
                                  px-4
                                  py-4
                                  dark:border-slate-800
                                "
                              >

                                <p
                                  className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-slate-400
                                  "
                                >
                                  Input
                                </p>


                                <pre
                                  className="
                                    mt-2
                                    whitespace-pre-wrap
                                    rounded-lg
                                    bg-slate-50
                                    p-3
                                    text-xs
                                    leading-5
                                    text-slate-600
                                    dark:bg-slate-950
                                    dark:text-slate-300
                                  "
                                >
                                  {example.input}
                                </pre>

                              </div>


                              <div
                                className="
                                  px-4
                                  py-4
                                "
                              >

                                <p
                                  className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-slate-400
                                  "
                                >
                                  Output
                                </p>


                                <pre
                                  className="
                                    mt-2
                                    whitespace-pre-wrap
                                    rounded-lg
                                    bg-slate-50
                                    p-3
                                    text-xs
                                    leading-5
                                    text-slate-600
                                    dark:bg-slate-950
                                    dark:text-slate-300
                                  "
                                >
                                  {example.output}
                                </pre>

                              </div>

                            </div>

                          )
                        )}

                      </div>

                    </div>
                  )}


                  {/* CONSTRAINTS */}

                  {problem.constraints && (

                    <div>

                      <h2
                        className="
                          text-sm
                          font-semibold
                          text-slate-900
                          dark:text-white
                        "
                      >
                        Constraints
                      </h2>

                      <div
                        className="
                          mt-3
                          rounded-xl
                          border
                          border-slate-200
                          bg-slate-50
                          p-4
                          dark:border-slate-800
                          dark:bg-slate-900/50
                        "
                      >

                        <p
                          className="
                            whitespace-pre-wrap
                            text-xs
                            leading-6
                            text-slate-500
                            dark:text-slate-400
                          "
                        >
                          {problem.constraints}
                        </p>

                      </div>

                    </div>
                  )}


                  {/* EXPLANATION */}

                  {problem.explanation && (

                    <div>

                      <h2
                        className="
                          text-sm
                          font-semibold
                          text-slate-900
                          dark:text-white
                        "
                      >
                        Explanation
                      </h2>

                      <p
                        className="
                          mt-3
                          whitespace-pre-wrap
                          text-xs
                          leading-6
                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        {problem.explanation}
                      </p>

                    </div>
                  )}

                </div>

              </div>

            </section>

          </div>


          {/* =================================
              HORIZONTAL DRAG HANDLE
          ================================= */}

          <div
            onMouseDown={() =>
              setIsDragging(true)
            }
            className="
              group
              relative
              w-1
              cursor-col-resize
              bg-transparent
            "
          >

            <div
              className="
                absolute
                inset-y-0
                left-0
                w-px
                bg-slate-200
                transition
                group-hover:bg-orange-500
                dark:bg-slate-800
              "
            />

          </div>


          {/* =================================
              RIGHT EDITOR
          ================================= */}

          <div
            style={{
              width:
                `${100 - leftWidth}%`,
            }}
            className="
              h-full
              pl-3
            "
          >

            <section
              id="editor-panel"
              className="
                flex
                h-full
                min-h-0
                flex-col
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                dark:border-slate-800
                dark:bg-slate-950
              "
            >

              {/* EDITOR HEADER */}

              <div
                className="
                  flex
                  h-16
                  shrink-0
                  items-center
                  justify-between
                  border-b
                  border-slate-200
                  px-5
                  dark:border-slate-800
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
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-lg
                      bg-orange-500/10
                      text-orange-500
                    "
                  >
                    <Code2Icon />
                  </div>


                  <div>

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-slate-900
                        dark:text-white
                      "
                    >
                      Code Editor
                    </p>

                    <p
                      className="
                        text-[10px]
                        text-slate-500
                      "
                    >
                      Write your solution
                    </p>

                  </div>


                  <select
                    value={language}
                    onChange={(event) =>
                      setLanguage(event.target.value as EditorLanguage)
                    }
                    className="
                      ml-3
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      px-3
                      py-2
                      text-xs
                      font-medium
                      text-slate-600
                      outline-none
                      transition
                      focus:border-orange-400
                      dark:border-slate-800
                      dark:bg-slate-900
                      dark:text-slate-300
                    "
                  >

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


                <div
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-full
                    bg-orange-500/10
                    px-3
                    py-2
                    text-xs
                    font-medium
                    text-orange-600
                    dark:text-orange-400
                  "
                >

                  <Clock
                    size={14}
                  />

                  {contest.durationMinutes}
                  {" "}
                  minutes

                </div>

              </div>


              {/* MONACO */}

              <div
                style={{
                  flex:
                    editorHeight,
                }}
                className="
                  min-h-0
                  overflow-hidden
                  bg-[#111111]
                "
              >

                <CodeEditor
                  language={
                    language
                  }
                  value={
                    code
                  }
                  onChange={
                    (value) => {

                      setCodes(
                        (previous) => ({
                          ...previous,
                          [language]:
                            value,
                        })
                      );

                    }
                  }
                />

              </div>


              {/* VERTICAL HANDLE */}

              <div
                onMouseDown={() =>
                  setIsVerticalDragging(
                    true
                  )
                }
                className="
                  group
                  relative
                  h-1
                  shrink-0
                  cursor-row-resize
                  bg-transparent
                "
              >

                <div
                  className="
                    absolute
                    inset-x-0
                    top-0
                    h-px
                    bg-slate-200
                    transition
                    group-hover:bg-orange-500
                    dark:bg-slate-800
                  "
                />

              </div>


              {/* BOTTOM PANEL */}

              <div
                style={{
                  flex:
                    100 -
                    editorHeight,
                }}
                className="
                  min-h-0
                  overflow-y-auto
                  bg-white
                  p-5
                  dark:bg-slate-950
                "
              >

                {/* OUTPUT */}

                {status && (

                  <div
                    className="
                      mb-5
                      overflow-hidden
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      dark:border-slate-800
                      dark:bg-slate-900/50
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-slate-200
                        px-4
                        py-3
                        dark:border-slate-800
                      "
                    >

                      <p
                        className="
                          text-xs
                          font-semibold
                          text-slate-700
                          dark:text-slate-300
                        "
                      >
                        Execution Result
                      </p>


                      <span
                        className={`
                          rounded-full
                          px-3
                          py-1
                          text-[10px]
                          font-semibold
                          ${getStatusStyle(
                            status
                          )}
                        `}
                      >
                        {status}
                      </span>

                    </div>


                    <pre
                      className="
                        min-h-20
                        max-h-48
                        overflow-auto
                        whitespace-pre-wrap
                        p-4
                        text-xs
                        leading-5
                        text-slate-600
                        dark:text-slate-300
                      "
                    >
                      {output ||
                        "No output."}
                    </pre>


                    <div
                      className="
                        grid
                        grid-cols-2
                        border-t
                        border-slate-200
                        dark:border-slate-800
                      "
                    >

                      <div
                        className="
                          px-4
                          py-3
                        "
                      >

                        <p
                          className="
                            text-[10px]
                            text-slate-400
                          "
                        >
                          Execution Time
                        </p>

                        <p
                          className="
                            mt-1
                            text-xs
                            font-medium
                            text-slate-700
                            dark:text-slate-300
                          "
                        >
                          {executionTime} ms
                        </p>

                      </div>


                      <div
                        className="
                          border-l
                          border-slate-200
                          px-4
                          py-3
                          dark:border-slate-800
                        "
                      >

                        <p
                          className="
                            text-[10px]
                            text-slate-400
                          "
                        >
                          Memory
                        </p>

                        <p
                          className="
                            mt-1
                            text-xs
                            font-medium
                            text-slate-700
                            dark:text-slate-300
                          "
                        >
                          {memory} MB
                        </p>

                      </div>

                    </div>

                  </div>
                )}


                {/* SUBMISSION RESULT */}

                {submissionResult && (

                  <div
                    className="
                      mb-5
                      overflow-hidden
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      dark:border-slate-800
                      dark:bg-slate-900/50
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-slate-200
                        px-4
                        py-3
                        dark:border-slate-800
                      "
                    >

                      <p
                        className="
                          text-xs
                          font-semibold
                          text-slate-700
                          dark:text-slate-300
                        "
                      >
                        Submission Result
                      </p>


                      <span
                        className={`
                          rounded-full
                          px-3
                          py-1
                          text-[10px]
                          font-semibold
                          ${getStatusStyle(
                            submissionResult.status
                          )}
                        `}
                      >
                        {
                          submissionResult.status
                        }
                      </span>

                    </div>


                    <div
                      className="
                        grid
                        grid-cols-3
                        divide-x
                        divide-slate-200
                        dark:divide-slate-800
                      "
                    >

                      <div className="p-4">

                        <p
                          className="
                            text-[10px]
                            text-slate-400
                          "
                        >
                          Test Cases
                        </p>

                        <p
                          className="
                            mt-1
                            text-sm
                            font-semibold
                            text-slate-800
                            dark:text-slate-200
                          "
                        >
                          {
                            submissionResult
                              .passedTestCases
                          }
                          {" / "}
                          {
                            submissionResult
                              .totalTestCases
                          }
                        </p>

                      </div>


                      <div className="p-4">

                        <p
                          className="
                            text-[10px]
                            text-slate-400
                          "
                        >
                          Execution Time
                        </p>

                        <p
                          className="
                            mt-1
                            text-sm
                            font-semibold
                            text-slate-800
                            dark:text-slate-200
                          "
                        >
                          {
                            submissionResult
                              .executionTime
                          }
                          {" "}
                          ms
                        </p>

                      </div>


                      <div className="p-4">

                        <p
                          className="
                            text-[10px]
                            text-slate-400
                          "
                        >
                          Memory
                        </p>

                        <p
                          className="
                            mt-1
                            text-sm
                            font-semibold
                            text-slate-800
                            dark:text-slate-200
                          "
                        >
                          {
                            submissionResult
                              .memory
                          }
                          {" "}
                          MB
                        </p>

                      </div>

                    </div>

                  </div>
                )}


                {/* CUSTOM INPUT */}

                <div className="mb-5">

                  <div
                    className="
                      mb-2
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <p
                      className="
                        text-xs
                        font-semibold
                        text-slate-700
                        dark:text-slate-300
                      "
                    >
                      Custom Input
                    </p>

                    <span
                      className="
                        text-[10px]
                        text-slate-400
                      "
                    >
                      Optional
                    </span>

                  </div>


                 <textarea
                   value={
                     customInput
                   }

                   onChange={(event) => {

                     setCustomInput(
                       event.target.value
                     );

                   }}

                   placeholder="Enter input for your program..."

                   className="
                     h-24
                     w-full
                     resize-none
                     rounded-xl
                     border
                     border-slate-200
                     bg-white
                     p-3
                     font-mono
                     text-xs
                     text-slate-700
                     outline-none
                     transition
                     placeholder:text-slate-400
                     focus:border-orange-400
                     dark:border-slate-800
                     dark:bg-slate-900/50
                     dark:text-slate-300
                     dark:placeholder:text-slate-600
                   "
                 />
                </div>


                {/* ACTIONS */}

                <div
                  className="
                    flex
                    flex-col-reverse
                    gap-3
                    sm:flex-row
                    sm:justify-end
                  "
                >

                  <button
                    onClick={
                      handleRunCode
                    }
                    disabled={
                      isRunning ||
                      isSubmitting
                    }
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-5
                      py-3
                      text-sm
                      font-medium
                      text-slate-600
                      transition
                      hover:border-slate-300
                      hover:text-slate-900
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                      dark:border-slate-800
                      dark:bg-slate-950
                      dark:text-slate-300
                      dark:hover:border-slate-700
                      dark:hover:text-white
                    "
                  >

                    <Play
                      size={15}
                    />

                    {isRunning
                      ? "Running..."
                      : "Run Code"}

                  </button>


                  <button
                    onClick={
                      handleSubmit
                    }
                    disabled={
                      isSubmitting ||
                      isRunning
                    }
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-orange-500
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      text-white
                      transition
                      hover:bg-orange-400
                      disabled:cursor-not-allowed
                      disabled:opacity-70
                    "
                  >

                    <Send
                      size={15}
                    />

                    {isSubmitting
                      ? "Submitting..."
                      : "Submit"}

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


/* =========================================
   SMALL ICON COMPONENT
========================================= */

function Code2Icon() {

  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}