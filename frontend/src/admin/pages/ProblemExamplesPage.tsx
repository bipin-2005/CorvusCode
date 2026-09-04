import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  FileCode2,
} from "lucide-react";

import {
  problemExampleService,
  type ProblemExample,
} from "../services/problemExampleService";

export default function ProblemExamplesPage() {
  const { id } = useParams();

  const [examples, setExamples] = useState<
    ProblemExample[]
  >([]);

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [explanation, setExplanation] =
    useState("");

  const [editingId, setEditingId] =
    useState<number | null>(null);

  useEffect(() => {
    loadExamples();
  }, []);

  const loadExamples = async () => {
    try {
      const response =
        await problemExampleService.getExamples(
          Number(id)
        );

      setExamples(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const saveExample = async () => {
    try {
      if (editingId) {
        await problemExampleService.updateExample(
          editingId,
          {
            input,
            output,
            explanation,
          }
        );
      } else {
        await problemExampleService.createExample(
          Number(id),
          {
            input,
            output,
            explanation,
          }
        );
      }

      clearForm();
      loadExamples();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteExample = async (
    exampleId: number
  ) => {
    try {
      await problemExampleService.deleteExample(
        exampleId
      );

      loadExamples();
    } catch (error) {
      console.error(error);
    }
  };

  const editExample = (
    example: ProblemExample
  ) => {
    setEditingId(example.id);
    setInput(example.input);
    setOutput(example.output);
    setExplanation(
      example.explanation || ""
    );
  };

  const clearForm = () => {
    setEditingId(null);
    setInput("");
    setOutput("");
    setExplanation("");
  };

  const inputClass = `
    w-full
    rounded-md
    border
    border-slate-200
    bg-white
    px-4
    py-3
    text-sm
    text-slate-900
    outline-none
    transition
    placeholder:text-slate-400
    focus:border-orange-500
    focus:ring-4
    focus:ring-orange-500/10

    dark:border-white/10
    dark:bg-black/20
    dark:text-slate-200
    dark:placeholder:text-slate-500
    dark:focus:border-orange-500/50
    dark:focus:ring-orange-500/10
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
            <FileCode2 className="h-6 w-6 text-orange-500" />
            Problem Examples
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
            Create and manage sample test cases that
            help users understand problem requirements.
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
            {editingId ? (
              <Pencil size={15} />
            ) : (
              <Plus size={16} />
            )}
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
                ? "// edit example"
                : "// add example"}
            </h2>

            <p
              className="
                mt-1
                text-xs
                text-slate-500
              "
            >
              Define sample inputs and expected outputs.
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
              Sample Input
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

          {/* Output */}

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
              value={output}
              onChange={(e) =>
                setOutput(e.target.value)
              }
              placeholder="4"
              className={inputClass}
            />
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
              placeholder="Explain why the output is correct..."
              className={inputClass}
            />
          </div>

          {/* Actions */}

          <div
            className="
              flex
              flex-wrap
              gap-2
              pt-1
            "
          >
            <button
              type="button"
              onClick={saveExample}
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
                ? "Update Example"
                : "Add Example"}
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
          EXAMPLE LIBRARY
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
              // example library
            </p>

            <p
              className="
                mt-1.5
                text-xs
                text-slate-500
              "
            >
              Manage all examples attached to this problem.
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
            {examples.length}{" "}
            {examples.length === 1
              ? "example"
              : "examples"}
          </span>
        </div>

        {examples.length === 0 ? (
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
              <FileCode2 size={18} />
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
              No Examples Yet
            </h3>

            <p
              className="
                mt-1.5
                text-xs
                text-slate-500
              "
            >
              Add your first example to help users
              understand the problem.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {examples.map((example, index) => (
              <div
                key={example.id}
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
                {/* Example heading */}

                <div
                  className="
                    mb-4
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
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
                      className="
                        font-mono
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-wider
                        text-slate-500
                      "
                    >
                      Sample Case
                    </span>
                  </div>
                </div>

                <div
                  className="
                    grid
                    gap-3
                    lg:grid-cols-3
                  "
                >
                  {/* Input */}

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
                      {example.input}
                    </pre>
                  </div>

                  {/* Output */}

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
                      Output
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
                      {example.output}
                    </pre>
                  </div>

                  {/* Explanation */}

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
                      Explanation
                    </p>

                    <div
                      className="
                        min-h-[76px]
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
                      {example.explanation ||
                        "No explanation provided"}
                    </div>
                  </div>
                </div>

                {/* Actions */}

                <div
                  className="
                    mt-4
                    flex
                    flex-wrap
                    gap-2
                    border-t
                    border-slate-200
                    pt-4
                    dark:border-white/10
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      editExample(example)
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
                      deleteExample(example.id)
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
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
