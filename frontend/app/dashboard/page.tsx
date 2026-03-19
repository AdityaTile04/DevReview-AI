"use client";

import { useEffect, useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Sparkles, Filter } from "lucide-react";
import api from "@/lib/api";

type ReviewIssueSeverity = "low" | "medium" | "high";

interface ReviewIssue {
  line?: number | null;
  message: string;
  severity: ReviewIssueSeverity;
}

interface StoredReview {
  language: string;
  sourceCode?: string;
  optimizedCode: string;
  result: {
    issues?: ReviewIssue[];
    suggestions?: string[];
    score?: number | null;
  };
  createdAt: number;
}

const STORAGE_KEY = "devreview:lastReview";
const EXPIRE_MS = 1000 * 60 * 60 * 6; // 6 hours

export default function DashboardPage() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const editorOptions = useMemo(
    () => ({
      fontSize: 16,
      lineHeight: 24,
      minimap: { enabled: false },
      wordWrap: "on" as const,
      scrollBeyondLastLine: false,
      padding: { top: 12, bottom: 12 },
      renderLineHighlight: "all" as const,
      scrollbar: {
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10,
      },
    }),
    []
  );

  const runReview = async () => {
    if (!code.trim()) return;

    try {
      setError(null);
      setLoading(true);

      const res = await api.post(
        "/reviews",
        { code, language },
        { withCredentials: true }
      );

      const review = res.data.review;
      const stored: StoredReview = {
        language,
        sourceCode: code,
        optimizedCode: review.optimizedCode || "",
        result: review.result || {},
        createdAt: Date.now(),
      };

      // Since GET /api/reviews/:id doesn't include optimizedCode, we keep the
      // POST payload for the results screen.
      localStorage.setItem("devreview:lastReview", JSON.stringify(stored));

      router.push("/dashboard/results");
    } catch (err) {
      console.error(err);
      setError("Failed to review code. Please try again.");
      alert("Failed to review code");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Restore previously reviewed code so the "Back" button doesn't show an empty editor.
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as StoredReview;
      if (!parsed?.createdAt || Date.now() - parsed.createdAt > EXPIRE_MS) return;

      if (typeof parsed.language === "string" && parsed.language) {
        setLanguage(parsed.language);
      }
      if (typeof parsed.sourceCode === "string") {
        setCode(parsed.sourceCode);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <main className="h-screen pt-16 bg-black text-white overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-zinc-800 bg-black/20 backdrop-blur flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Filter className="text-indigo-400" size={18} />
            Review Code
          </div>

          <div className="flex items-center gap-4">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="bg-zinc-900 border-zinc-800 w-[190px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="python">Python</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={runReview}
              disabled={loading || !code.trim()}
              className="bg-indigo-500 hover:bg-indigo-600 gap-2"
            >
              <Sparkles size={16} />
              {loading ? "Reviewing…" : "Review Code"}
            </Button>
          </div>
        </div>

        {error && (
          <div className="px-6 pt-4">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="flex-1 min-h-0 p-6">
          <Card className="h-full bg-zinc-950 border-zinc-800 overflow-hidden">
            <Editor
              height="100%"
              value={code}
              onChange={(v) => setCode(v || "")}
              language={language}
              theme="vs-dark"
              options={{
                ...editorOptions,
              }}
            />
          </Card>
        </div>
      </div>
    </main>
  );
}
