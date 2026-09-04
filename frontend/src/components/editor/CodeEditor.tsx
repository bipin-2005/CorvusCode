import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
}

export default function CodeEditor({
  language,
  value,
  onChange,
}: CodeEditorProps) {
  const [theme, setTheme] = useState<"vs" | "vs-dark">(
    document.documentElement.classList.contains("dark")
      ? "vs-dark"
      : "vs"
  );

  useEffect(() => {
    const html = document.documentElement;

    const updateTheme = () => {
      setTheme(
        html.classList.contains("dark")
          ? "vs-dark"
          : "vs"
      );
    };

    updateTheme();

    const observer = new MutationObserver(
      updateTheme
    );

    observer.observe(html, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      onChange={(value) =>
        onChange(value ?? "")
      }
      theme={theme}
      options={{
        minimap: {
          enabled: false,
        },

        fontSize: 14,

        lineNumbers: "on",

        roundedSelection: false,

        scrollBeyondLastLine: false,

        automaticLayout: true,

        tabSize: 4,

        padding: {
          top: 16,
          bottom: 16,
        },

        wordWrap: "on",

        suggestOnTriggerCharacters: true,

        quickSuggestions: true,
      }}
    />
  );
}