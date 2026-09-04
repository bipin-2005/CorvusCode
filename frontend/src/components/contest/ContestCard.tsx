import { Link } from "react-router-dom";
import type { Contest } from "../../types/contest";

interface ContestCardProps {
  contest: Contest;
}

const ContestCard = ({ contest }: ContestCardProps) => {
  const getStatusStyles = () => {
    switch (contest.status) {
      case "UPCOMING":
        return `
          border-orange-500/20
          bg-orange-500/10
          text-orange-600
          dark:text-orange-400
        `;

      case "RUNNING":
        return `
          border-emerald-500/20
          bg-emerald-500/10
          text-emerald-600
          dark:text-emerald-400
        `;

      case "ENDED":
        return `
          border-slate-200
          bg-slate-100
          text-slate-500
          dark:border-white/10
          dark:bg-white/[0.04]
          dark:text-slate-400
        `;

      default:
        return `
          border-blue-500/20
          bg-blue-500/10
          text-blue-600
          dark:text-blue-400
        `;
    }
  };

  return (
    <div
      className="
        group
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-lg
        border
        border-slate-200
        bg-white
        p-5
        transition-colors
        duration-200
        hover:border-orange-500/30
        dark:border-white/10
        dark:bg-[#111113]
        dark:hover:border-orange-500/20
      "
    >
      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="flex-1">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">

          <h2
            className="
              min-w-0
              line-clamp-2
              text-base
              font-semibold
              leading-6
              text-slate-900
              transition-colors
              group-hover:text-orange-600
              dark:text-slate-100
              dark:group-hover:text-orange-400
            "
          >
            {contest.title}
          </h2>

          {/* Status */}
          <span
            className={`
              shrink-0
              rounded-full
              border
              px-2.5
              py-1
              text-[10px]
              font-semibold
              uppercase
              tracking-wider
              ${getStatusStyles()}
            `}
          >
            {contest.status}
          </span>

        </div>

        {/* Description */}
        <p
          className="
            mt-3
            min-h-[66px]
            line-clamp-3
            text-sm
            leading-5
            text-slate-600
            dark:text-slate-400
          "
        >
          {contest.description ||
            "No description available."}
        </p>

        {/* Divider */}
        <div
          className="
            my-4
            border-t
            border-slate-200
            dark:border-white/10
          "
        />

        {/* =================================================
            CONTEST DETAILS
        ================================================== */}

        <div className="space-y-2.5">

          {/* Start */}
          <div className="flex items-center justify-between gap-4 text-xs">
            <span className="shrink-0 text-slate-500 dark:text-slate-500">
              Start
            </span>

            <span className="text-right font-medium text-slate-700 dark:text-slate-300">
              {new Date(
                contest.startTime
              ).toLocaleString()}
            </span>
          </div>

          {/* End */}
          <div className="flex items-center justify-between gap-4 text-xs">
            <span className="shrink-0 text-slate-500 dark:text-slate-500">
              End
            </span>

            <span className="text-right font-medium text-slate-700 dark:text-slate-300">
              {new Date(
                contest.endTime
              ).toLocaleString()}
            </span>
          </div>

          {/* Duration */}
          <div className="flex items-center justify-between gap-4 text-xs">
            <span className="shrink-0 text-slate-500 dark:text-slate-500">
              Duration
            </span>

            <span className="font-medium text-orange-600 dark:text-orange-400">
              {contest.durationMinutes} min
            </span>
          </div>

        </div>
      </div>

      {/* =====================================================
          ACTION
      ====================================================== */}

      <Link
        to={`/contests/${contest.id}`}
        className="
          mt-5
          flex
          items-center
          justify-center
          gap-2
          rounded-md
          border
          border-orange-500/20
          bg-orange-500/10
          px-4
          py-2.5
          text-xs
          font-semibold
          text-orange-600
          transition-colors
          duration-200
          hover:border-orange-500/30
          hover:bg-orange-500/15
          dark:text-orange-400
          dark:hover:bg-orange-500/20
        "
      >
        View Contest

        <span
          className="
            transition-transform
            duration-200
            group-hover:translate-x-0.5
          "
        >
          →
        </span>
      </Link>
    </div>
  );
};

export default ContestCard;