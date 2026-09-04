interface StatsCardProps {
  title: string;
  value: string | number;
  detail?: string;
}

export default function StatsCard({
  title,
  value,
  detail,
}: StatsCardProps) {
  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-lg
        border
        border-slate-200
        bg-white
        p-5
        transition-colors
        duration-200
        hover:border-slate-300
        hover:bg-slate-50
        dark:border-white/10
        dark:bg-[#111113]
        dark:hover:border-white/20
      "
    >
      {/* Accent Line */}
      <div
        className="
          absolute
          left-0
          top-0
          h-full
          w-px
          bg-orange-500/0
          transition-colors
          duration-200
          group-hover:bg-orange-500/60
        "
      />

      {/* Label */}
      <p
        className="
          font-mono
          text-[11px]
          font-semibold
          uppercase
          tracking-wider
          text-slate-500
          dark:text-slate-400
        "
      >
        {title}
      </p>

      {/* Value + Detail */}
      <div className="mt-3 flex items-end justify-between gap-3">
        <h2
          className="
            text-3xl
            font-bold
            leading-none
            tracking-tight
            text-slate-900
            dark:text-white
          "
        >
          {value}
        </h2>

        {detail && (
          <span
            className="
              max-w-[50%]
              pb-0.5
              text-right
              text-[11px]
              leading-tight
              text-slate-500
              dark:text-slate-400
            "
          >
            {detail}
          </span>
        )}
      </div>
    </div>
  );
}