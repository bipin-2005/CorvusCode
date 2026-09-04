import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { problemService } from "../services/problemService";

export default function AdminProblemFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    difficulty: "EASY",
    description: "",
    constraints: "",
    inputFormat: "",
    outputFormat: "",
    explanation: "",
    timeLimit: 1,
    memoryLimit: 256,
  });

  useEffect(() => {
    if (isEditMode) {
      loadProblem();
    }
  }, [id]);

  const loadProblem = async () => {
    try {
      const response =
        await problemService.getProblemById(
          Number(id)
        );

      const problem = response.data.data;

      setFormData({
        title: problem.title,
        difficulty: problem.difficulty,
        description: problem.description,
        constraints:
          problem.constraints || "",
        inputFormat:
          problem.inputFormat || "",
        outputFormat:
          problem.outputFormat || "",
        explanation:
          problem.explanation || "",
        timeLimit: problem.timeLimit,
        memoryLimit:
          problem.memoryLimit,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "timeLimit" ||
        name === "memoryLimit"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (isEditMode) {
        await problemService.updateProblem(
          Number(id),
          formData
        );
      } else {
        await problemService.createProblem(
          formData
        );
      }

      navigate("/admin/problems");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `
    w-full
    rounded-md
    border
    border-slate-200
    bg-white
    px-3
    py-2.5
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
    <div className="min-h-screen bg-white text-slate-900 dark:bg-[#0a0a0b] dark:text-white">
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Header */}

        <section>
          <p className="mb-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-500">
            Problem Management
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {isEditMode
              ? "Edit Problem"
              : "Create Problem"}
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-slate-500">
            Create coding challenges with
            detailed descriptions,
            constraints, input/output formats
            and execution limits.
          </p>
        </section>

        {/* Basic Information */}

        <section
          className="
            rounded-lg
            border
            border-slate-200
            bg-white
            p-5
            dark:border-white/10
            dark:bg-[#111113]
          "
        >
          <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
            Basic Information
          </h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-600">
            Core problem details
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs text-slate-600 dark:text-slate-500">
                Problem Title
              </label>

              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={inputClass}
                placeholder="Two Sum"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs text-slate-600 dark:text-slate-500">
                Difficulty
              </label>

              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="EASY">
                  Easy
                </option>

                <option value="MEDIUM">
                  Medium
                </option>

                <option value="HARD">
                  Hard
                </option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-xs text-slate-600 dark:text-slate-500">
              Description
            </label>

            <textarea
              rows={10}
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={inputClass}
              placeholder="Describe the problem statement..."
            />
          </div>
        </section>

        {/* Problem Specification */}

        <section
          className="
            rounded-lg
            border
            border-slate-200
            bg-white
            p-5
            dark:border-white/10
            dark:bg-[#111113]
          "
        >
          <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
            Problem Specification
          </h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-600">
            Define formats and constraints
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-xs text-slate-600 dark:text-slate-500">
                Constraints
              </label>

              <textarea
                rows={5}
                name="constraints"
                value={formData.constraints}
                onChange={handleChange}
                className={inputClass}
                placeholder="1 ≤ n ≤ 10^5"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs text-slate-600 dark:text-slate-500">
                Input Format
              </label>

              <textarea
                rows={5}
                name="inputFormat"
                value={formData.inputFormat}
                onChange={handleChange}
                className={inputClass}
                placeholder="The first line contains..."
              />
            </div>

            <div>
              <label className="mb-2 block text-xs text-slate-600 dark:text-slate-500">
                Output Format
              </label>

              <textarea
                rows={5}
                name="outputFormat"
                value={formData.outputFormat}
                onChange={handleChange}
                className={inputClass}
                placeholder="Print the required answer..."
              />
            </div>

            <div>
              <label className="mb-2 block text-xs text-slate-600 dark:text-slate-500">
                Explanation
              </label>

              <textarea
                rows={5}
                name="explanation"
                value={formData.explanation}
                onChange={handleChange}
                className={inputClass}
                placeholder="Explain the sample case..."
              />
            </div>
          </div>
        </section>

        {/* Execution Limits */}

        <section
          className="
            rounded-lg
            border
            border-slate-200
            bg-white
            p-5
            dark:border-white/10
            dark:bg-[#111113]
          "
        >
          <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
            Execution Limits
          </h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-600">
            Configure runtime restrictions
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs text-slate-600 dark:text-slate-500">
                Time Limit (Seconds)
              </label>

              <input
                type="number"
                name="timeLimit"
                value={formData.timeLimit}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs text-slate-600 dark:text-slate-500">
                Memory Limit (MB)
              </label>

              <input
                type="number"
                name="memoryLimit"
                value={formData.memoryLimit}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* Actions */}

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() =>
              navigate("/admin/problems")
            }
            className="
              rounded-md
              border
              border-slate-300
              px-4
              py-2.5
              text-sm
              text-slate-700
              transition
              hover:bg-slate-100
              dark:border-white/10
              dark:text-slate-300
              dark:hover:bg-white/[0.02]
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="
              rounded-md
              bg-orange-500
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-orange-400
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loading
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
              ? "Update Problem"
              : "Create Problem"}
          </button>
        </div>
      </form>
    </div>
  );
}