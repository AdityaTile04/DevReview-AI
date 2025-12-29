"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Sparkles, Filter, Code2, Wand2, AlertTriangle } from "lucide-react";
import api from "@/lib/api";

interface Issue {
  line?: number | null;
  message: string;
  severity: "low" | "medium" | "high";
}

export default function DashboardPage() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [optimized, setOptimized] = useState("");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const runReview = async () => {
    if (!code.trim()) return;

    try {
      setLoading(true);
      setIssues([]);
      setSuggestions([]);
      setScore(null);
      setOptimized("");

      const res = await api.post(
        "/reviews",
        { code, language },
        { withCredentials: true }
      );

      const review = res.data.review;
      const result = review.result;

      setIssues(result.issues || []);
      setSuggestions(result.suggestions || []);
      setScore(result.score ?? null);

      setOptimized(review.optimizedCode || "");
    } catch (err) {
      console.error(err);
      alert("Failed to review code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen bg-black text-white flex overflow-hidden">
      <aside className="w-80 bg-zinc-950 border-r border-zinc-800 p-6 flex flex-col gap-5">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <Filter className="text-indigo-400" size={18} />
          Review Settings
        </div>

        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="bg-zinc-900 border-zinc-800">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="typescript">TypeScript</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="python">Python</SelectItem>
          </SelectContent>
        </Select>

        <Separator />

        <Button
          onClick={runReview}
          disabled={loading}
          className="mt-auto bg-indigo-500 hover:bg-indigo-600 gap-2"
        >
          <Sparkles size={16} />
          {loading ? "Reviewing…" : "Review Code"}
        </Button>
      </aside>

      <section className="flex-1 flex flex-col">
        <div className="flex flex-1 border-b border-zinc-800">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-1/2 p-6 border-r border-zinc-800 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-3 text-zinc-300">
              <Code2 size={16} className="text-indigo-400" />
              Input Code
            </div>

            <Card className="flex-1 bg-zinc-950 border-zinc-800 overflow-hidden">
              <Editor
                value={code}
                onChange={(v) => setCode(v || "")}
                language={language}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  wordWrap: "on",
                }}
              />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-1/2 p-6 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-3 text-zinc-300">
              <Wand2 size={16} className="text-indigo-400" />
              Reviewed Code
              {loading && (
                <span className="ml-2 text-sm text-indigo-400 animate-pulse">
                  AI analyzing…
                </span>
              )}
            </div>

            <Card className="flex-1 bg-zinc-950 border-zinc-800 overflow-hidden">
              <Editor
                value={optimized}
                language={language}
                theme="vs-dark"
                options={{
                  readOnly: true,
                  fontSize: 14,
                  minimap: { enabled: false },
                  wordWrap: "on",
                }}
              />
            </Card>
          </motion.div>
        </div>

        <div className="min-h-[260px] p-6">
          <Tabs defaultValue="issues">
            <TabsList className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-1 flex gap-1">
              <TabsTrigger
                value="issues"
                className="data-[state=active]:bg-white data-[state=active]:text-black
               text-zinc-300 hover:text-white hover:bg-zinc-800
               rounded-lg px-4 py-2 transition"
              >
                Issues
              </TabsTrigger>

              <TabsTrigger
                value="suggestions"
                className="data-[state=active]:bg-white data-[state=active]:text-black
               text-zinc-300 hover:text-white hover:bg-zinc-800
               rounded-lg px-4 py-2 transition"
              >
                Suggestions
              </TabsTrigger>

              <TabsTrigger
                value="score"
                className="data-[state=active]:bg-white data-[state=active]:text-black
               text-zinc-300 hover:text-white hover:bg-zinc-800
               rounded-lg px-4 py-2 transition"
              >
                Score
              </TabsTrigger>
            </TabsList>

            <TabsContent value="issues">
              <Card className="mt-4 bg-zinc-950 border-zinc-800 p-4">
                <ScrollArea className="h-44 space-y-3 text-sm">
                  {!loading && issues.length === 0 && score !== null && (
                    <p className="text-zinc-400">No issues found 🎉</p>
                  )}

                  {issues.map((issue, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center bg-zinc-900/60 p-3 rounded-md"
                    >
                      <span className="flex items-center gap-2 text-zinc-100">
                        <AlertTriangle className="text-red-400" size={14} />
                        {issue.message}
                      </span>

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
                </ScrollArea>
              </Card>
            </TabsContent>
            <TabsContent value="suggestions">
              <Card className="mt-4 bg-zinc-950 border-zinc-800">
                <ScrollArea className="h-44 px-4 py-3 space-y-3 text-sm">
                  {suggestions.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-md bg-zinc-900/70 hover:bg-zinc-900 transition"
                    >
                      <span className="mt-1 h-2 w-2 rounded-full bg-indigo-400" />
                      <span className="text-zinc-100">{s}</span>
                    </div>
                  ))}
                </ScrollArea>
              </Card>
            </TabsContent>

            <TabsContent value="score">
              <Card className="mt-4 bg-zinc-950 border-zinc-800 p-6 text-center">
                {score !== null ? (
                  <>
                    <div className="text-6xl font-bold text-indigo-400">
                      {score}
                    </div>
                    <p className="text-zinc-400 mt-2">Code Quality Score</p>
                  </>
                ) : (
                  <p className="text-zinc-500">Run a review to see score</p>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  );
}
