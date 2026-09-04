import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { contestService } from "../../services/contest.service";

import {
  getAllProblems,
  type Problem,
} from "../../services/problem.service";

import {
  getContestProblems,
  addProblemToContest,
  removeProblemFromContest,
  type ContestProblem,
} from "../../services/contestProblem.service";
export default function AdminContestFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);

  const [availableProblems, setAvailableProblems] =
    useState<Problem[]>([]);

  const [contestProblems, setContestProblems] =
    useState<ContestProblem[]>([]);

  const [problemsLoading, setProblemsLoading] =
    useState(false);

  const [showAddProblem, setShowAddProblem] =
    useState(false);

  const [selectedProblemId, setSelectedProblemId] =
    useState<number | "">("");

  const [problemPoints, setProblemPoints] =
    useState(100);

  const [problemOrder, setProblemOrder] =
    useState(1);

  const [addingProblem, setAddingProblem] =
    useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",

    registrationStart: "",
    registrationEnd: "",

    startTime: "",
    endTime: "",

    durationMinutes: 120,

    visibility: "PUBLIC",

    registrationRequired: true,

    ranked: true,
  });

useEffect(() => {
  if (isEditMode) {
    loadContest();
    loadContestProblems();
  }
}, [id]);

  const loadContest = async () => {
    try {
      const response =
        await contestService.getContest(
          Number(id)
        );

      const contest = response.data;

      setFormData({
        title: contest.title || "",
        description:
          contest.description || "",

        registrationStart:
          contest.registrationStart?.slice(
            0,
            16
          ) || "",

        registrationEnd:
          contest.registrationEnd?.slice(
            0,
            16
          ) || "",

        startTime:
          contest.startTime?.slice(
            0,
            16
          ) || "",

        endTime:
          contest.endTime?.slice(
            0,
            16
          ) || "",

        durationMinutes:
          contest.durationMinutes || 120,

        visibility:
          contest.visibility || "PUBLIC",

        registrationRequired:
          contest.registrationRequired,

        ranked: contest.ranked,
      });
    } catch (error) {
      console.error(error);
    }
  };
const loadContestProblems = async () => {
  if (!id) return;

  try {
    setProblemsLoading(true);

    const [problems, contestProblemsData] =
      await Promise.all([
        getAllProblems(),
        getContestProblems(Number(id)),
      ]);

    setAvailableProblems(problems);
    setContestProblems(contestProblemsData);

  } catch (error) {
    console.error(
      "Failed to load contest problems:",
      error
    );

  } finally {
    setProblemsLoading(false);
  }
};

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "durationMinutes"
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

        await contestService.updateContest(
          Number(id),
          formData
        );

        // Stay on the edit page
        await loadContest();

      } else {

        const createdContest =
          await contestService.createContest(
            formData
          );

        console.log(
          "Created contest:",
          createdContest
        );

        // Get the newly created contest ID
        const contestId =
          createdContest.id;

        // Immediately open edit page
        navigate(
          `/admin/contests/${contestId}/edit`
        );
      }

    } catch (error) {

      console.error(
        "Failed to save contest:",
        error
      );

    } finally {

      setLoading(false);
    }
  };
const handleAddProblem = async () => {

  if (!id || selectedProblemId === "") {
    return;
  }

  try {

    setAddingProblem(true);

    await addProblemToContest(
      Number(id),
      {
        problemId: Number(selectedProblemId),
        points: problemPoints,
        displayOrder: problemOrder,
      }
    );

    await loadContestProblems();

    setSelectedProblemId("");

    setProblemPoints(100);

    setProblemOrder(
      contestProblems.length + 2
    );

    setShowAddProblem(false);

  } catch (error) {

    console.error(
      "Failed to add problem:",
      error
    );

  } finally {

    setAddingProblem(false);
  }
};
const handleRemoveProblem = async (
  problemId: number
) => {

  if (!id) return;

  try {

    await removeProblemFromContest(
      Number(id),
      problemId
    );

    await loadContestProblems();

  } catch (error) {

    console.error(
      "Failed to remove problem:",
      error
    );
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
            Contest Management
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {isEditMode
              ? "Edit Contest"
              : "Create Contest"}
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-slate-500">
            Configure registration windows,
            contest schedules and
            participation settings.
          </p>
        </section>

        {/* Contest Information */}

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
            Contest Information
          </h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-600">
            Basic contest details
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-xs text-slate-600 dark:text-slate-500">
                Contest Title
              </label>

              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={inputClass}
                placeholder="Weekly Contest #1"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs text-slate-600 dark:text-slate-500">
                Description
              </label>

              <textarea
                rows={5}
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={inputClass}
                placeholder="Describe the contest..."
              />
            </div>
          </div>
        </section>

        {/* Registration Window */}

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
            Registration Window
          </h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-600">
            Configure participant
            registration dates
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs text-slate-600 dark:text-slate-500">
                Registration Start
              </label>

              <input
                type="datetime-local"
                name="registrationStart"
                value={
                  formData.registrationStart
                }
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs text-slate-600 dark:text-slate-500">
                Registration End
              </label>

              <input
                type="datetime-local"
                name="registrationEnd"
                value={
                  formData.registrationEnd
                }
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* Contest Schedule */}

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
            Contest Schedule
          </h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-600">
            Configure contest timings
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs text-slate-600 dark:text-slate-500">
                Contest Start
              </label>

              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs text-slate-600 dark:text-slate-500">
                Contest End
              </label>

              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* Contest Settings */}

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
            Contest Settings
          </h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-600">
            Visibility and participation
            options
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs text-slate-600 dark:text-slate-500">
                Duration (Minutes)
              </label>

              <input
                type="number"
                name="durationMinutes"
                value={
                  formData.durationMinutes
                }
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs text-slate-600 dark:text-slate-500">
                Visibility
              </label>

              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="PUBLIC">
                  Public
                </option>

                <option value="PRIVATE">
                  Private
                </option>
              </select>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {/* Registration Required */}
            <label
              className="
                flex
                items-center
                gap-3
                rounded-md
                border
                border-slate-200
                bg-slate-50
                p-4
                dark:border-white/10
                dark:bg-black/20
              "
            >
              <input
                type="checkbox"
                name="registrationRequired"
                checked={
                  formData.registrationRequired
                }
                onChange={handleChange}
                className="h-4 w-4 accent-orange-500"
              />

              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-200">
                  Registration Required
                </p>

                <p className="text-xs text-slate-500">
                  Users must register before
                  participating
                </p>
              </div>
            </label>

            {/* Ranked */}
            <label
              className="
                flex
                items-center
                gap-3
                rounded-md
                border
                border-slate-200
                bg-slate-50
                p-4
                dark:border-white/10
                dark:bg-black/20
              "
            >
              <input
                type="checkbox"
                name="ranked"
                checked={formData.ranked}
                onChange={handleChange}
                className="h-4 w-4 accent-orange-500"
              />

              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-200">
                  Ranked Contest
                </p>

                <p className="text-xs text-slate-500">
                  Contest affects user
                  rankings
                </p>
              </div>
            </label>
          </div>
        </section>

        {/* Contest Problems */}

        {isEditMode && (
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
            <div className="flex items-center justify-between gap-4">

              <div>
                <h2
                  className="
                    text-sm
                    font-semibold
                    text-slate-900
                    dark:text-slate-200
                  "
                >
                  Contest Problems
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Add and manage the problems used in this contest.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setProblemOrder(
                    contestProblems.length + 1
                  );

                  setShowAddProblem(true);
                }}
                className="
                  rounded-md
                  bg-orange-500
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-orange-400
                "
              >
                + Add Problem
              </button>

            </div>


            {/* Existing Problems */}

            {problemsLoading ? (

              <div className="mt-6 py-8 text-center">
                <p className="text-sm text-slate-500">
                  Loading problems...
                </p>
              </div>

            ) : contestProblems.length === 0 ? (

              <div
                className="
                  mt-6
                  rounded-md
                  border
                  border-dashed
                  border-slate-300
                  p-8
                  text-center
                  dark:border-slate-700
                "
              >
                <p
                  className="
                    text-sm
                    font-medium
                    text-slate-700
                    dark:text-slate-300
                  "
                >
                  No problems added yet
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Add problems before publishing the contest.
                </p>
              </div>

            ) : (

              <div className="mt-6 space-y-3">

                {contestProblems.map(
                  (contestProblem) => (

                    <div
                      key={contestProblem.id}
                      className="
                        flex
                        items-center
                        justify-between
                        gap-4
                        rounded-md
                        border
                        border-slate-200
                        bg-slate-50
                        p-4
                        dark:border-white/10
                        dark:bg-black/20
                      "
                    >

                      <div className="flex items-center gap-4">

                        <div
                          className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-lg
                            bg-orange-500/10
                            text-sm
                            font-bold
                            text-orange-500
                          "
                        >
                          {contestProblem.displayOrder}
                        </div>

                        <div>

                          <p
                            className="
                              text-sm
                              font-semibold
                              text-slate-900
                              dark:text-slate-200
                            "
                          >
                            {contestProblem.title}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {contestProblem.difficulty}
                            {" · "}
                            {contestProblem.points} points
                          </p>

                        </div>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveProblem(
                            contestProblem.problemId
                          )
                        }
                        className="
                          rounded-lg
                          border
                          border-red-200
                          px-3
                          py-2
                          text-xs
                          font-medium
                          text-red-500
                          hover:bg-red-50
                          dark:border-red-900/50
                          dark:hover:bg-red-950/30
                        "
                      >
                        Remove
                      </button>

                    </div>

                  )
                )}

              </div>
            )}


            {/* Add Problem Form */}

            {showAddProblem && (

              <div
                className="
                  mt-6
                  rounded-md
                  border
                  border-orange-500/20
                  bg-orange-500/5
                  p-5
                "
              >

                <h3
                  className="
                    text-sm
                    font-semibold
                    text-slate-900
                    dark:text-slate-200
                  "
                >
                  Add Problem
                </h3>


                <div className="mt-4 grid gap-4 md:grid-cols-3">

                  {/* SELECT PROBLEM */}

                  <div className="md:col-span-3">

                    <label
                      className="
                        mb-2
                        block
                        text-xs
                        font-medium
                        text-slate-600
                        dark:text-slate-400
                      "
                    >
                      Problem
                    </label>

                    <select
                      value={selectedProblemId}
                      onChange={(e) =>
                        setSelectedProblemId(
                          e.target.value === ""
                            ? ""
                            : Number(e.target.value)
                        )
                      }
                      className={inputClass}
                    >

                      <option value="">
                        Select a problem
                      </option>

                      {availableProblems
                        .filter(
                          (problem) =>
                            !contestProblems.some(
                              (contestProblem) =>
                                contestProblem.problemId ===
                                problem.id
                            )
                        )
                        .map((problem) => (
                          <option
                            key={problem.id}
                            value={problem.id}
                          >
                            {problem.title} — {problem.difficulty}
                          </option>
                        ))}

                    </select>

                  </div>


                  {/* POINTS */}

                  <div>

                    <label
                      className="
                        mb-2
                        block
                        text-xs
                        font-medium
                        text-slate-600
                        dark:text-slate-400
                      "
                    >
                      Points
                    </label>

                    <input
                      type="number"
                      min={1}
                      value={problemPoints}
                      onChange={(e) =>
                        setProblemPoints(
                          Number(e.target.value)
                        )
                      }
                      className={inputClass}
                    />

                  </div>


                  {/* DISPLAY ORDER */}

                  <div>

                    <label
                      className="
                        mb-2
                        block
                        text-xs
                        font-medium
                        text-slate-600
                        dark:text-slate-400
                      "
                    >
                      Display Order
                    </label>

                    <input
                      type="number"
                      min={1}
                      value={problemOrder}
                      onChange={(e) =>
                        setProblemOrder(
                          Number(e.target.value)
                        )
                      }
                      className={inputClass}
                    />

                  </div>

                </div>


                {/* Add Problem Actions */}

                <div className="mt-5 flex justify-end gap-3">

                  <button
                    type="button"
                    onClick={() => {
                      setShowAddProblem(false);
                      setSelectedProblemId("");
                    }}
                    className="
                      rounded-md
                      border
                      border-slate-300
                      px-4
                      py-2.5
                      text-sm
                      font-medium
                      text-slate-700
                      dark:border-slate-700
                      dark:text-slate-300
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={
                      selectedProblemId === "" ||
                      addingProblem
                    }
                    onClick={handleAddProblem}
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
                      disabled:opacity-50
                    "
                  >
                    {addingProblem
                      ? "Adding..."
                      : "Add Problem"}
                  </button>

                </div>

              </div>
            )}

          </section>
        )}

        {/* Actions */}

        <div className="flex justify-end gap-4 pt-2">
          <button
            type="button"
            onClick={() =>
              navigate("/admin/contests")
            }
            className="
              rounded-md
              border
              border-slate-300
              px-5
              py-3
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
              px-6
              py-3
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
              ? "Update Contest"
              : "Create Contest"}
          </button>
        </div>
      </form>
    </div>
  );
}