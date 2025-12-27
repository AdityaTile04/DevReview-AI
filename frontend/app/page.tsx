"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Code2, Zap, ShieldCheck, Brain } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="bg-black text-white overflow-hidden">
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl"
        >
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            AI-Powered Code Reviews <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              for Backend Developers
            </span>
          </h1>

          <p className="mt-6 text-lg text-zinc-400">
            DevReview AI analyzes your code, finds issues, suggests
            improvements, and scores quality — instantly.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <Link href="/signup">
              <Button className="px-8 py-6 text-lg">Get Started</Button>
            </Link>

            <Link href="/login">
              <Button
                variant="outline"
                className="px-8 py-6 text-lg text-black"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="py-28 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              icon: <Brain size={28} />,
              title: "AI Code Intelligence",
              desc: "Understands backend logic, architecture, scalability, and real-world best practices.",
            },
            {
              icon: <Zap size={28} />,
              title: "Instant Feedback",
              desc: "Get structured review results in seconds instead of manual code reviews that take hours.",
            },
            {
              icon: <ShieldCheck size={28} />,
              title: "Secure & Private",
              desc: "Your code is never stored or used for training. Privacy-first by design.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
            >
              <Card
                className="group h-full min-h-[240px] bg-zinc-950 border border-zinc-800 p-8 flex flex-col justify-between
                transition-all duration-300 hover:-translate-y-2 hover:border-indigo-500/60 hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.4)]"
              >
                <div>
                  <div className="mb-5 text-indigo-400 transition group-hover:scale-110">
                    {item.icon}
                  </div>

                  <h3 className="text-2xl font-semibold mb-3 text-white">
                    {item.title}
                  </h3>

                  <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />

        <div className="relative max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            How DevReview AI Works
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-zinc-400 max-w-2xl mx-auto mb-20"
          >
            A simple three-step workflow designed for backend engineers who
            value speed, clarity, and quality.
          </motion.p>

          <div className="relative grid md:grid-cols-3 gap-12">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

            {[
              {
                step: "01",
                title: "Paste Your Code",
                desc: "Drop in your backend code — APIs, services, controllers, or full modules.",
                gradient: "from-indigo-500 to-purple-500",
              },
              {
                step: "02",
                title: "AI Analyzes Logic",
                desc: "We analyze structure, architecture, performance, and best practices.",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                step: "03",
                title: "Get Actionable Review",
                desc: "Receive issues, improvement suggestions, and a quality score instantly.",
                gradient: "from-pink-500 to-rose-500",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="relative"
              >
                <div
                  className="group h-full rounded-2xl border border-zinc-800 bg-black/60 backdrop-blur-xl
            p-8 transition-all duration-300 hover:-translate-y-3
            hover:border-indigo-500/50 hover:shadow-[0_0_50px_-15px_rgba(99,102,241,0.45)]"
                >
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-xl
              bg-gradient-to-r ${item.gradient} text-black font-bold text-lg mb-6`}
                  >
                    {item.step}
                  </div>

                  <h3 className="text-2xl font-semibold mb-3 text-white">
                    {item.title}
                  </h3>

                  <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-zinc-950 border border-zinc-800 rounded-xl p-8"
        >
          <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Code2 /> Example AI Review Output
          </h3>

          <pre className="bg-black rounded-lg p-4 text-sm text-zinc-300 overflow-x-auto">
            {`Score: 82/100

Issues:
- Avoid hardcoded values
- Improve error handling
- Use dependency injection

Suggestions:
- Extract config constants
- Add proper logging`}
          </pre>
        </motion.div>
      </section>

      <section className="py-32 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">
            Ship Better Backend Code Faster
          </h2>
          <p className="text-zinc-400 mb-8">
            Join developers using AI to level up code quality.
          </p>

          <Link href="/signup">
            <Button size="lg" className="px-10 py-6 text-lg">
              Start Reviewing Code
            </Button>
          </Link>
        </motion.div>
      </section>

      <footer className="border-t border-zinc-800 py-6 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} DevReview AI. Built for developers.
      </footer>
    </main>
  );
}
