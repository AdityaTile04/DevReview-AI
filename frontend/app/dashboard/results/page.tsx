"use client";

import { useEffect, useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import { AlertTriangle, ArrowLeft, Sparkles } from "lucide-react";

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

export default function DashboardResultsPage() {
  const router = useRouter();
  const [storedReview, setStoredReview] = useState<StoredReview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setStoredReview(null);
        return;
      }

      const parsed = JSON.parse(raw) as StoredReview;
      if (!parsed?.createdAt || Date.now() - parsed.createdAt > EXPIRE_MS) {
        setStoredReview(null);
        return;
      }

      setStoredReview(parsed);
    } catch (err) {
      console.error(err);
      setStoredReview(null);
    } finally {
      setLoading(false);
    }
  }, []);

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

  const issues = storedReview?.result?.issues ?? [];
  const suggestions = storedReview?.result?.suggestions ?? [];
  const score = storedReview?.result?.score ?? null;

  return (
    <main className="h-screen pt-16 bg-black text-white overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-zinc-800 bg-black/20 backdrop-blur flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard")}
              className="border-zinc-800 text-zinc-200 bg-zinc-950/30 hover:!bg-zinc-900/50 hover:!text-zinc-100"
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>
            <div>
              <div className="flex items-center gap-2 font-semibold text-lg">
                <Sparkles className="text-indigo-400" size={18} />
                Review Results
              </div>
              <div className="text-sm text-zinc-400">
                {storedReview?.language ? `Language: ${storedReview.language}` : "Language"}
              </div>
            </div>
          </div>

          {score !== null && (
            <div className="text-right">
              <div className="text-3xl font-bold text-indigo-400">{score}</div>
              <div className="text-sm text-zinc-400">Quality Score</div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex-1 min-h-0 flex items-center justify-center p-6 text-zinc-400">
            Loading results…
          </div>
        ) : !storedReview ? (
          <div className="flex-1 min-h-0 flex items-center justify-center p-6">
            <Card className="bg-zinc-950 border-zinc-800 p-8">
              <div className="text-zinc-100 font-semibold text-lg">
                No results found
              </div>
              <p className="text-zinc-400 mt-2">
                Run a review first, and you’ll see the optimized code and
                suggestions here.
              </p>
              <Button
                onClick={() => router.push("/dashboard")}
                className="mt-5 bg-indigo-500 hover:bg-indigo-600"
              >
                Review Code
              </Button>
            </Card>
          </div>
        ) : (
          <div className="flex-1 min-h-0 flex">
            <div className="flex-1 min-h-0 p-6">
              <Card className="h-full bg-zinc-950 border-zinc-800 overflow-hidden">
                <Editor
                  height="100%"
                  value={storedReview.optimizedCode}
                  language={storedReview.language}
                  theme="vs-dark"
                  options={{
                    readOnly: true,
                    ...editorOptions,
                  }}
                />
              </Card>
            </div>

            <aside className="w-[420px] min-h-0 border-l border-zinc-800/70 p-6 bg-black/10 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold text-zinc-100">Suggestions</div>
                <div className="text-sm text-zinc-400">
                  {issues.length + suggestions.length} items
                </div>
              </div>

              <div className="flex-1 min-h-0">
                <ScrollArea className="h-full pr-3">
                  <div className="space-y-6">
                    <div>
                      <div className="font-semibold text-zinc-100 mb-3 flex items-center gap-2">
                        <AlertTriangle className="text-red-400" size={16} />
                        Issues
                      </div>
                      {issues.length === 0 ? (
                        <p className="text-zinc-400">No issues found.</p>
                      ) : (
                        <div className="space-y-3">
                          {issues.map((issue, i) => (
                            <div
                              key={i}
                              className="flex justify-between items-start gap-3 bg-zinc-900/60 p-3 rounded-md"
                            >
                              <div className="flex items-start gap-2">
                                <AlertTriangle
                                  className="text-red-400 mt-0.5"
                                  size={14}
                                />
                                <p className="text-zinc-100 text-sm leading-relaxed">
                                  {issue.message}
                                </p>
                              </div>
                              <Badge
                                className={
                                  issue.severity === "high"
                                    ? "bg-red-600"
                                    : issue.severity === "medium"
                                      ? "bg-yellow-500 text-black"
                                      : "bg-green-600"
                                }
                              >
                                {issue.severity}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="font-semibold text-zinc-100 mb-3">
                        Suggestions
                      </div>
                      {suggestions.length === 0 ? (
                        <p className="text-zinc-400">No suggestions available.</p>
                      ) : (
                        <div className="space-y-3">
                          {suggestions.map((s, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-3 p-3 rounded-md bg-zinc-900/70 hover:bg-zinc-900 transition"
                            >
                              <span className="mt-1 h-2 w-2 rounded-full bg-indigo-400" />
                              <p className="text-zinc-100 text-sm leading-relaxed">
                                {s}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

