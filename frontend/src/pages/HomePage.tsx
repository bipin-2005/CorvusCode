import { useNavigate } from "react-router-dom";
import {
  Code2,
  Trophy,
  Users,
  ArrowRight,
  BarChart3,
  Briefcase,
  BookOpen,
  Check,
} from "lucide-react";

import FadeUp from "../components/animations/FadeUp";

export default function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Code2 size={22} />,
      tag: "dsa",
      title: "Curated Coding Problems",
      description:
        "Solve carefully selected problems covering arrays, linked lists, trees, graphs, dynamic programming, SQL, and interview-focused topics.",
    },
    {
      icon: <Briefcase size={22} />,
      tag: "interview",
      title: "Interview Preparation",
      description:
        "Practice real interview questions and company-focused problem sets designed to help you prepare for technical assessments and coding rounds.",
    },
    {
      icon: <BookOpen size={22} />,
      tag: "paths",
      title: "Structured Learning Paths",
      description:
        "Follow guided roadmaps for Data Structures, Algorithms, Frontend Development, Backend Engineering, and System Design.",
    },
    {
      icon: <BarChart3 size={22} />,
      tag: "analytics",
      title: "Performance Analytics",
      description:
        "Track problem-solving consistency, learning progress, weak areas, completion rates, and overall growth over time.",
    },
    {
      icon: <Trophy size={22} />,
      tag: "contests",
      title: "Competitive Challenges",
      description:
        "Participate in coding competitions, challenge yourself under time pressure, and sharpen your problem-solving skills.",
    },
    {
      icon: <Users size={22} />,
      tag: "community",
      title: "Developer Community",
      description:
        "Learn alongside other developers, discuss approaches, share solutions, and grow through collaborative learning.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white">

      {/* ================================================= */}
      {/* NAVBAR */}
      {/* ================================================= */}

      <nav
        className="
          sticky
          top-0
          z-50
          border-b
          border-orange-500/10
          bg-white/90
          backdrop-blur-xl

          dark:bg-slate-950/80
        "
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            CORVUS
            <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              CODE
            </span>
          </h1>

          <div
            className="
              hidden
              items-center
              gap-8
              text-sm
              font-medium
              text-slate-600

              dark:text-slate-300

              md:flex
            "
          >
            <button
              onClick={() => navigate("/problems")}
              className="transition hover:text-orange-500 dark:hover:text-orange-400"
            >
              Problems
            </button>

            <button
              onClick={() => navigate("/contests")}
              className="transition hover:text-orange-500 dark:hover:text-orange-400"
            >
              Contests
            </button>

            <button
              onClick={() => navigate("/leaderboard")}
              className="transition hover:text-orange-500 dark:hover:text-orange-400"
            >
              Leaderboard
            </button>
          </div>

          <button
            onClick={() => navigate("/login")}
            className="
              rounded-xl
              bg-orange-500
              px-5
              py-2.5
              font-semibold
              text-white
              transition-all
              hover:bg-orange-600
            "
          >
            Login
          </button>

        </div>
      </nav>

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="relative overflow-hidden">

        {/* Background Grid */}

        <div
          className="
            absolute
            inset-0
            opacity-40

            dark:opacity-100
          "
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.12) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Glow */}

        <div className="absolute left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 pt-8 lg:grid-cols-2">

          {/* LEFT */}

          <FadeUp>
            <div>

              <div className="inline-flex items-center rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-500 dark:text-orange-400">
                Learn • Practice • Get Hired
              </div>

              <h1 className="mt-8 text-5xl font-black leading-[1.02] tracking-tight text-slate-900 dark:text-white md:text-7xl">
                Master

                <span className="block bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  Data Structures
                </span>

                &amp; Algorithms
              </h1>

              <p className="mt-8 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-400">
                Solve curated coding challenges, follow structured learning paths,
                prepare for interviews, and build the skills needed to become a
                software engineer.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">

                <button
                  onClick={() => navigate("/register")}
                  className="
                    group
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-orange-500
                    px-8
                    py-4
                    font-semibold
                    text-white
                    transition-all
                    hover:bg-orange-600
                  "
                >
                  Get Started

                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>

                <button
                  onClick={() => navigate("/problems")}
                  className="
                    rounded-xl
                    border
                    border-slate-300
                    px-8
                    py-4
                    font-semibold
                    text-slate-800
                    transition-all
                    hover:border-orange-500
                    hover:bg-orange-50

                    dark:border-slate-700
                    dark:text-white
                    dark:hover:bg-slate-900
                  "
                >
                  Explore Problems
                </button>

              </div>

            </div>
          </FadeUp>

          {/* RIGHT — live code editor */}

          <FadeUp delay={0.1}>
            <div className="relative flex justify-center">

              <div
                className="
                  w-full
                  max-w-xl
                  overflow-hidden
                  rounded-2xl
                  border
                  border-orange-500/20
                  bg-white
                  shadow-[0_0_80px_rgba(249,115,22,0.08)]
                  backdrop-blur-xl

                  dark:bg-[#101010]/90
                  dark:shadow-[0_0_80px_rgba(249,115,22,0.12)]
                "
              >

                {/* tab bar */}
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                    </div>
                    <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                      twoSum.js
                    </span>
                  </div>
                  <span className="rounded-lg bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-500 dark:text-orange-400">
                    Level 12
                  </span>
                </div>

                {/* code */}
                <div className="flex px-3 py-5 font-mono text-[13px] leading-6">
                  <div className="select-none pr-4 text-right text-slate-300 dark:text-slate-700">
                    {Array.from({ length: 8 }, (_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>
                  <div className="text-slate-800 dark:text-slate-300">
                    <div>
                      <span className="text-orange-500 dark:text-orange-400">function</span>{" "}
                      twoSum(nums, target) {"{"}
                    </div>
                    <div className="pl-4">
                      <span className="text-orange-500 dark:text-orange-400">const</span> seen ={" "}
                      <span className="text-orange-500 dark:text-orange-400">new</span> Map();
                    </div>
                    <div className="pl-4">
                      <span className="text-orange-500 dark:text-orange-400">for</span> (
                      <span className="text-orange-500 dark:text-orange-400">let</span> i = 0; i &lt;
                      nums.length; i++) {"{"}
                    </div>
                    <div className="pl-8">
                      <span className="text-orange-500 dark:text-orange-400">const</span> rest =
                      target - nums[i];
                    </div>
                    <div className="pl-8">
                      <span className="text-orange-500 dark:text-orange-400">if</span>{" "}
                      (seen.has(rest)) {"{"}
                    </div>
                    <div className="pl-12">
                      <span className="text-orange-500 dark:text-orange-400">return</span> [seen.get(rest), i];
                    </div>
                    <div className="pl-8">{"}"}</div>
                    <div className="pl-4">{"}"}</div>
                  </div>
                </div>

                {/* test panel */}
                <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/60">
                  <div className="space-y-1.5 font-mono text-xs">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Check size={13} className="text-emerald-500" /> case_1 · 1ms
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Check size={13} className="text-emerald-500" /> case_2 · 1ms
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Check size={13} className="text-emerald-500" /> case_3 · 2ms
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      All tests passed
                    </span>
                    <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
                      6ms · beats 94%
                    </span>
                  </div>
                </div>

                {/* stats */}
                <div className="grid grid-cols-3 divide-x divide-slate-200 border-t border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                  <div className="px-5 py-4 text-center">
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Solved
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                      247
                    </h3>
                  </div>
                  <div className="px-5 py-4 text-center">
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Streak
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                      32
                    </h3>
                  </div>
                  <div className="px-5 py-4 text-center">
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Rank
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                      Top 8%
                    </h3>
                  </div>
                </div>

              </div>

            </div>
          </FadeUp>

        </div>

      </section>

      {/* ================================================= */}
      {/* FEATURES */}
      {/* ================================================= */}

      <section
        className="
          border-t
          border-slate-200
          py-24

          dark:border-slate-900
        "
      >

        <FadeUp>

          <div className="mx-auto max-w-7xl px-6">

            {/* Header */}

            <div className="mx-auto max-w-4xl text-center">

              <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-orange-500 dark:text-orange-400">
                Features
              </span>

              <h2 className="mt-8 text-4xl font-black leading-[1.15] text-slate-900 dark:text-white md:text-6xl">
                Everything You Need To

                <span className="mt-3 block bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text pb-2 text-transparent">
                  Master Software Engineering
                </span>
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
                From coding practice and interview preparation to structured
                learning paths and progress tracking, everything is available
                in one place.
              </p>

            </div>

            {/* Features Grid — redesigned */}

            <div className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 dark:border-slate-800 dark:bg-slate-800 sm:grid-cols-2 lg:grid-cols-3">

              {features.map((feature) => (

                <div
                  key={feature.title}
                  className="
                    group
                    relative
                    bg-white
                    p-8
                    transition-colors
                    duration-300
                    hover:bg-orange-50/60

                    dark:bg-[#0b0b0b]
                    dark:hover:bg-[#141210]
                  "
                >

                  <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-orange-500 transition-transform duration-300 group-hover:scale-x-100" />

                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-orange-500/20 text-orange-500 dark:text-orange-400">
                      {feature.icon}
                    </div>
                    <code className="font-mono text-xs text-slate-400 dark:text-slate-600">
                      {feature.tag}
                    </code>
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </FadeUp>

      </section>

      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

      <footer
        className="
          border-t
          border-slate-200
          bg-white

          dark:border-slate-900
          dark:bg-slate-950
        "
      >

        <div className="mx-auto max-w-7xl px-6 py-10">

          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr]">

            {/* Brand */}

            <div>

              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                CORVUS
                <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  CODE
                </span>
              </h2>

              <p className="mt-5 max-w-md leading-8 text-slate-600 dark:text-slate-400">
                A modern platform for coding practice, interview preparation,
                and structured software engineering learning.
              </p>

              <div className="mt-8 flex gap-4">

                <a
                  href="#"
                  className="
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-2
                    text-sm
                    text-slate-600
                    transition
                    hover:border-orange-500
                    hover:text-orange-500

                    dark:border-slate-800
                    dark:text-slate-400
                    dark:hover:text-orange-400
                  "
                >
                  GitHub
                </a>

                <a
                  href="#"
                  className="
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-2
                    text-sm
                    text-slate-600
                    transition
                    hover:border-orange-500
                    hover:text-orange-500

                    dark:border-slate-800
                    dark:text-slate-400
                    dark:hover:text-orange-400
                  "
                >
                  LinkedIn
                </a>

                <a
                  href="#"
                  className="
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-2
                    text-sm
                    text-slate-600
                    transition
                    hover:border-orange-500
                    hover:text-orange-500

                    dark:border-slate-800
                    dark:text-slate-400
                    dark:hover:text-orange-400
                  "
                >
                  Discord
                </a>

              </div>

            </div>

            {/* Product */}

            <div>

              <h3 className="font-semibold text-slate-900 dark:text-white">
                Product
              </h3>

              <ul className="mt-6 space-y-4 text-slate-600 dark:text-slate-400">

                <li>
                  <a
                    href="#"
                    className="transition hover:text-orange-500 dark:hover:text-orange-400"
                  >
                    Problems
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="transition hover:text-orange-500 dark:hover:text-orange-400"
                  >
                    Learning Paths
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="transition hover:text-orange-500 dark:hover:text-orange-400"
                  >
                    Interview Prep
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="transition hover:text-orange-500 dark:hover:text-orange-400"
                  >
                    Progress Tracking
                  </a>
                </li>

              </ul>

            </div>

            {/* Company */}

            <div>

              <h3 className="font-semibold text-slate-900 dark:text-white">
                Company
              </h3>

              <ul className="mt-6 space-y-4 text-slate-600 dark:text-slate-400">

                <li>
                  <a
                    href="#"
                    className="transition hover:text-orange-500 dark:hover:text-orange-400"
                  >
                    About
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="transition hover:text-orange-500 dark:hover:text-orange-400"
                  >
                    Contact
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="transition hover:text-orange-500 dark:hover:text-orange-400"
                  >
                    Privacy Policy
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="transition hover:text-orange-500 dark:hover:text-orange-400"
                  >
                    Terms of Service
                  </a>
                </li>

              </ul>

            </div>

          </div>

          {/* Copyright */}

          <div className="mt-8 border-t border-slate-200 pt-5 dark:border-slate-900">

            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">

              <p className="text-sm text-slate-500">
                © {new Date().getFullYear()} CORVUSCODE. All rights reserved.
              </p>

              <p className="text-sm text-slate-500 dark:text-slate-600">
                Built for developers who never stop learning.
              </p>

            </div>

          </div>

        </div>

      </footer>

    </div>
  );
}