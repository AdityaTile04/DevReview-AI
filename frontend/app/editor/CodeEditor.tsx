"use client";

import Editor from "@monaco-editor/react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  language: string;
};

export default function CodeEditor({ value, onChange, language }: Props) {
  return (
    <Editor
      height="100%"
      theme="vs-dark"
      language={language}
      value={value}
      onChange={(v) => onChange(v || "")}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        cursorSmoothCaretAnimation: "on",
        automaticLayout: true,
        padding: { top: 12 },
      }}
    />
  );
}
