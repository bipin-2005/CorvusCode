import type { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  className?: string;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
  className,
}: AuthLayoutProps) {
  return (
    <div
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-white
        transition-colors
        duration-200
        dark:bg-slate-950
      "
    >
      {/* Background */}
      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_top_left,#fb923c25,transparent_35%),radial-gradient(circle_at_bottom_right,#ea580c18,transparent_40%)]
          dark:bg-[radial-gradient(circle_at_top_left,#fb923c30,transparent_35%),radial-gradient(circle_at_bottom_right,#ea580c25,transparent_40%)]
        "
      />

      {/* Orange glow */}
      <div
        className="
          absolute
          bottom-[-250px]
          left-1/2
          h-[600px]
          w-[900px]
          -translate-x-1/2
          rounded-full
          bg-orange-500/10
          blur-[180px]
          dark:bg-orange-500/15
        "
      />

      <div
        className="
          relative
          mx-auto
          flex
          min-h-screen
          max-w-7xl
          items-center
          px-6
          py-12
          lg:px-12
        "
      >
        {/* Left Side */}
        <div className="hidden flex-1 lg:flex">
          <div className="max-w-xl">

            {/* Badge */}
            <div
              className="
                inline-flex
                items-center
                rounded-full
                border
                border-orange-500/30
                bg-orange-500/10
                px-5
                py-2
                text-sm
                font-medium
                text-orange-600
                backdrop-blur-md
                dark:text-orange-300
              "
            >
              Competitive Programming Platform
            </div>

            {/* Logo */}
            <h1
              className="
                mt-8
                text-6xl
                font-black
                tracking-tight
                text-slate-900
                dark:text-white
              "
            >
              CORVUS
              <span
                className="
                  bg-gradient-to-r
                  from-orange-400
                  to-orange-600
                  bg-clip-text
                  text-transparent
                "
              >
                CODE
              </span>
            </h1>

            {/* Main heading */}
            <p
              className="
                mt-6
                text-5xl
                font-black
                leading-tight
                text-slate-900
                dark:text-white
              "
            >
              Practice.
              <br />
              Compete.
              <br />
              <span className="text-orange-500">
                Get Hired.
              </span>
            </p>

            {/* Description */}
            <p
              className="
                mt-8
                max-w-lg
                text-lg
                leading-8
                text-slate-600
                dark:text-slate-400
              "
            >
              Practice coding problems, compete in contests,
              track your progress, and prepare for technical
              interviews—all in one platform.
            </p>

            <div className="mt-12 flex gap-5" />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-1 justify-center lg:justify-end">
          <div
            className={`
              w-full
              max-w-md
              rounded-3xl
              border
              border-orange-500/20
              bg-white/90
              p-8
              shadow-[0_0_70px_rgba(249,115,22,0.10)]
              backdrop-blur-2xl
              transition-colors
              duration-200
              dark:bg-[#101010]/90
              dark:shadow-[0_0_70px_rgba(249,115,22,0.15)]
              ${className ?? ""}
            `}
          >
            {/* Title */}
            <h2
              className="
                text-4xl
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              {title}
            </h2>

            {/* Subtitle */}
            <p
              className="
                mt-2
                text-slate-600
                dark:text-slate-400
              "
            >
              {subtitle}
            </p>

            {/* Form */}
            <div className="mt-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}