import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Code2,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  starterCodeService,
  type StarterCode,
} from "../services/starterCodeService";

export default function ProblemStarterCodesPage() {
  const { id } = useParams();

  const [codes, setCodes] = useState<
    StarterCode[]
  >([]);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [language, setLanguage] =
    useState("JAVA");

  const [templateCode, setTemplateCode] =
    useState("");

  useEffect(() => {
    loadStarterCodes();
  }, []);

  const loadStarterCodes = async () => {
    try {
      const response =
        await starterCodeService.getStarterCodes(
          Number(id)
        );

      setCodes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const saveStarterCode = async () => {
    try {
      const payload = {
        language,
        templateCode,
        problemId: Number(id),
      };

      if (editingId) {
        await starterCodeService.updateStarterCode(
          editingId,
          payload
        );
      } else {
        await starterCodeService.createStarterCode(
          payload
        );
      }

      clearForm();
      loadStarterCodes();
    } catch (error) {
      console.error(error);
    }
  };

  const editStarterCode = (
    code: StarterCode
  ) => {
    setEditingId(code.id);
    setLanguage(code.language);
    setTemplateCode(code.templateCode);
  };

  const deleteStarterCode = async (
    starterCodeId: number
  ) => {
    try {
      await starterCodeService.deleteStarterCode(
        starterCodeId
      );

      loadStarterCodes();
    } catch (error) {
      console.error(error);
    }
  };

  const clearForm = () => {
    setEditingId(null);
    setLanguage("JAVA");
    setTemplateCode("");
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
            <Code2 className="h-6 w-6 text-orange-500" />
            Starter Codes
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
            Manage starter code templates for different
            programming languages.
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
                ? "// edit starter code"
                : "// add starter code"}
            </h2>

            <p
              className="
                mt-1
                text-xs
                text-slate-500
              "
            >
              Create language-specific code templates.
            </p>
          </div>
        </div>

        <div className="space-y-4 p-5">
          {/* Language */}

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
              Programming Language
            </label>

            <select
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value)
              }
              className={inputClass}
            >
              <option value="JAVA">
                Java
              </option>

              <option value="PYTHON">
                Python
              </option>

              <option value="CPP">
                C++
              </option>

              <option value="JAVASCRIPT">
                JavaScript
              </option>
            </select>
          </div>

          {/* Template */}

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
              Starter Template
            </label>

            <textarea
              rows={16}
              value={templateCode}
              onChange={(e) =>
                setTemplateCode(e.target.value)
              }
              placeholder="Write starter code here..."
              className={`${inputClass} font-mono`}
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
              onClick={saveStarterCode}
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
                ? "Update Starter Code"
                : "Add Starter Code"}
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
          STARTER CODE LIBRARY
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
              // starter code library
            </p>

            <p
              className="
                mt-1.5
                text-xs
                text-slate-500
              "
            >
              Manage all language templates for this problem.
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
            {codes.length}{" "}
            {codes.length === 1
              ? "template"
              : "templates"}
          </span>
        </div>

        {codes.length === 0 ? (
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
              <Code2 size={18} />
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
              No Starter Codes
            </h3>

            <p
              className="
                mt-1.5
                text-xs
                text-slate-500
              "
            >
              Add starter code templates for supported languages.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {codes.map((code, index) => (
              <div
                key={code.id}
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
                        rounded-md
                        border
                        border-cyan-500/20
                        bg-cyan-500/10
                        px-2.5
                        py-1
                        font-mono
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-wider
                        text-cyan-600
                        dark:text-cyan-400
                      "
                    >
                      {code.language}
                    </span>
                  </div>

                  {/* Actions */}

                  <div
                    className="
                      flex
                      flex-wrap
                      gap-2
                    "
                  >
                    <button
                      type="button"
                      onClick={() =>
                        editStarterCode(code)
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
                        deleteStarterCode(code.id)
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

                {/* Code Preview */}

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
                    Template Preview
                  </p>

                  <pre
                    className="
                      max-h-[320px]
                      overflow-auto
                      rounded-md
                      border
                      border-slate-200
                      bg-slate-50
                      p-4
                      font-mono
                      text-xs
                      leading-5
                      text-slate-700

                      dark:border-white/10
                      dark:bg-black/20
                      dark:text-slate-300
                    "
                  >
                    <code>
                      {code.templateCode.length > 300
                        ? `${code.templateCode.slice(
                            0,
                            300
                          )}...`
                        : code.templateCode}
                    </code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
