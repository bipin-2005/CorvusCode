import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  FlaskConical,
} from "lucide-react";

import {
  testCaseService,
  type TestCase,
  type TestCaseType,
} from "../services/testCaseService";

export default function ProblemTestCasesPage() {
  const { id } = useParams();

  const [testCases, setTestCases] = useState<
    TestCase[]
  >([]);

  const [input, setInput] = useState("");
  const [expectedOutput, setExpectedOutput] =
    useState("");

  const [type, setType] =
    useState<TestCaseType>("SAMPLE");

  const [explanation, setExplanation] =
    useState("");

  const [editingId, setEditingId] =
    useState<number | null>(null);

  useEffect(() => {
    loadTestCases();
  }, []);

  const loadTestCases = async () => {
    try {
      const response =
        await testCaseService.getByProblem(
          Number(id)
        );

      setTestCases(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const clearForm = () => {
    setEditingId(null);
    setInput("");
    setExpectedOutput("");
    setType("SAMPLE");
    setExplanation("");
  };

  const saveTestCase = async () => {
    try {
      const payload = {
        input,
        expectedOutput,
        type,
        explanation,
        problemId: Number(id),
      };

      if (editingId) {
        await testCaseService.update(
          editingId,
          payload
        );
      } else {
        await testCaseService.create(
          payload
        );
      }

      clearForm();
      loadTestCases();
    } catch (error) {
      console.error(error);
    }
  };

  const editTestCase = (
    testCase: TestCase
  ) => {
    setEditingId(testCase.id);
    setInput(testCase.input);
    setExpectedOutput(
      testCase.expectedOutput
    );
    setType(testCase.type);
    setExplanation(
      testCase.explanation || ""
    );
  };

  const deleteTestCase = async (
    testCaseId: number
  ) => {
    try {
      await testCaseService.delete(
        testCaseId
      );

      loadTestCases();
    } catch (error) {
      console.error(error);
    }
  };

  const inputClass = `
    w-full
    rounded-md
    border
    border-slate-300
    bg-white
    px-4
    py-3
    text-sm
    text-slate-900
    outline-none
    transition
    placeholder:text-slate-400
    focus:border-orange-500/50
    dark:border-white/10
    dark:bg-black/20
    dark:text-slate-200
    dark:placeholder:text-slate-500
  `;

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
        <div className="p-5 sm:p-6">
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
            <FlaskConical className="h-6 w-6 text-orange-500" />
            Test Cases
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
            Manage sample and hidden test cases used
            for validating problem submissions.
          </p>
        </div>
      </section>

      {/* =====================================================
          FORM
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
            items-center
            gap-3
            border-b
            border-slate-200
            px-5
            py-4
            dark:border-white/10
          "
        >
          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-md
              bg-orange-500/10
              text-orange-500
            "
          >
            <Plus size={16} />
          </div>

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
              {editingId
                ? "// edit test case"
                : "// add test case"}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Configure input, expected output and validation data.
            </p>
          </div>
        </div>

        <div className="space-y-4 p-5">
          {/* Input */}

          <div>
            <label
              className="
                mb-1.5
                block
                font-mono
                text-[10px]
                font-semibold
                uppercase
                tracking-wider
                text-slate-500
              "
            >
              Test Input
            </label>

            <textarea
              rows={5}
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              placeholder="1 2 3 4"
              className={inputClass}
            />
          </div>

          {/* Expected Output */}

          <div>
            <label
              className="
                mb-1.5
                block
                font-mono
                text-[10px]
                font-semibold
                uppercase
                tracking-wider
                text-slate-500
              "
            >
              Expected Output
            </label>

            <textarea
              rows={4}
              value={expectedOutput}
              onChange={(e) =>
                setExpectedOutput(e.target.value)
              }
              placeholder="10"
              className={inputClass}
            />
          </div>

          {/* Type */}

          <div>
            <label
              className="
                mb-1.5
                block
                font-mono
                text-[10px]
                font-semibold
                uppercase
                tracking-wider
                text-slate-500
              "
            >
              Test Case Type
            </label>

            <select
              value={type}
              onChange={(e) =>
                setType(
                  e.target.value as TestCaseType
                )
              }
              className={inputClass}
            >
              <option value="SAMPLE">Sample</option>
              <option value="HIDDEN">Hidden</option>
            </select>
          </div>

          {/* Explanation */}

          <div>
            <label
              className="
                mb-1.5
                block
                font-mono
                text-[10px]
                font-semibold
                uppercase
                tracking-wider
                text-slate-500
              "
            >
              Explanation
            </label>

            <textarea
              rows={4}
              value={explanation}
              onChange={(e) =>
                setExplanation(e.target.value)
              }
              placeholder="Optional explanation..."
              className={inputClass}
            />
          </div>

          {/* Actions */}

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={saveTestCase}
              className="
                inline-flex
                items-center
                gap-2
                rounded-md
                bg-orange-500
                px-4
                py-2.5
                text-xs
                font-semibold
                text-white
                transition-colors
                hover:bg-orange-400
              "
            >
              {editingId
                ? "Update Test Case"
                : "Add Test Case"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={clearForm}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-md
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-2.5
                  text-xs
                  font-medium
                  text-slate-600
                  transition-colors
                  hover:bg-slate-50

                  dark:border-white/10
                  dark:bg-transparent
                  dark:text-slate-300
                  dark:hover:bg-white/[0.03]
                "
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          TEST CASE LIBRARY
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
              // test case library
            </p>

            <p className="mt-1.5 text-xs text-slate-500">
              All configured test cases for this problem.
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
            {testCases.length}{" "}
            {testCases.length === 1
              ? "test case"
              : "test cases"}
          </span>
        </div>

        {testCases.length === 0 ? (
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
              <FlaskConical size={18} />
            </div>

            <h3
              className="
                mt-4
                text-sm
                font-semibold
                text-slate-900
                dark:text-slate-200
              "
            >
              No Test Cases Found
            </h3>

            <p className="mt-1.5 text-xs text-slate-500">
              Add test cases to validate user submissions.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {testCases.map((testCase, index) => (
              <div
                key={testCase.id}
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
                {/* Header */}

                <div
                  className="
                    flex
                    flex-col
                    gap-4
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                  "
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="
                        flex
                        h-7
                        min-w-7
                        items-center
                        justify-center
                        rounded-md
                        bg-orange-500/10
                        px-2
                        font-mono
                        text-[10px]
                        font-semibold
                        text-orange-500
                      "
                    >
                      {String(index + 1).padStart(2, "0")}
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
                          testCase.type === "SAMPLE"
                            ? `
                              border-green-500/20
                              bg-green-500/10
                              text-green-600
                              dark:text-green-400
                            `
                            : `
                              border-purple-500/20
                              bg-purple-500/10
                              text-purple-600
                              dark:text-purple-400
                            `
                        }
                      `}
                    >
                      {testCase.type}
                    </span>
                  </div>

                  {/* Actions */}

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        editTestCase(testCase)
                      }
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
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteTestCase(testCase.id)
                      }
                      className="
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

                {/* Divider */}

                <div
                  className="
                    my-4
                    border-t
                    border-slate-200
                    dark:border-white/10
                  "
                />

                {/* Input / Output */}

                <div className="grid gap-3 lg:grid-cols-2">
                  <div>
                    <p
                      className="
                        mb-1.5
                        font-mono
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-wider
                        text-slate-500
                      "
                    >
                      Input
                    </p>

                    <pre
                      className="
                        min-h-[76px]
                        overflow-auto
                        whitespace-pre-wrap
                        rounded-md
                        border
                        border-slate-200
                        bg-slate-50
                        p-3
                        font-mono
                        text-xs
                        leading-5
                        text-slate-700

                        dark:border-white/10
                        dark:bg-black/20
                        dark:text-slate-300
                      "
                    >
                      {testCase.input}
                    </pre>
                  </div>

                  <div>
                    <p
                      className="
                        mb-1.5
                        font-mono
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-wider
                        text-slate-500
                      "
                    >
                      Expected Output
                    </p>

                    <pre
                      className="
                        min-h-[76px]
                        overflow-auto
                        whitespace-pre-wrap
                        rounded-md
                        border
                        border-slate-200
                        bg-slate-50
                        p-3
                        font-mono
                        text-xs
                        leading-5
                        text-slate-700

                        dark:border-white/10
                        dark:bg-black/20
                        dark:text-slate-300
                      "
                    >
                      {testCase.expectedOutput}
                    </pre>
                  </div>
                </div>

                {/* Explanation */}

                {testCase.explanation && (
                  <div className="mt-3">
                    <p
                      className="
                        mb-1.5
                        font-mono
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-wider
                        text-slate-500
                      "
                    >
                      Explanation
                    </p>

                    <div
                      className="
                        rounded-md
                        border
                        border-slate-200
                        bg-slate-50
                        p-3
                        text-xs
                        leading-5
                        text-slate-700

                        dark:border-white/10
                        dark:bg-black/20
                        dark:text-slate-300
                      "
                    >
                      {testCase.explanation}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
