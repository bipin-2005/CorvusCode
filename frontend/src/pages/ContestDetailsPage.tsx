import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  Award,
  CheckCircle2,
  Clock3,
  Code2,
  Download,
  Medal,
  Trophy,
  Users,
} from "lucide-react";

import { toast } from "sonner";

import {
  getContestById,
  getContestProblems,
  getContestLeaderboard,
  registerForContest,
  enterContest,
  getMyParticipation,
} from "../services/contest.service";

import {
  getMyContestCertificate,
  downloadCertificate,
  type CertificateResponse,
} from "../services/certificate.service";

/* =========================================================
   TYPES
========================================================= */

interface ContestProblem {
  id: number;
  problemId: number;
  problemTitle: string;
  points: number;
}

interface ContestData {
  id: number;
  title: string;
  description: string;

  registrationStart: string;
  registrationEnd: string;

  startTime: string;
  endTime: string;

  durationMinutes: number;

  status:
    | "UPCOMING"
    | "RUNNING"
    | "ENDED"
    | "CANCELLED";

  registered?: boolean;
  participantCount?: number;
  finalized?: boolean;
}

interface LeaderboardEntry {
  userId: number;
  fullName: string;
  rank: number;
  score: number;
  solvedCount: number;
}

/* =========================================================
   PAGE
========================================================= */

const ContestDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  /* =========================================================
     STATE
  ========================================================= */

  const [contest, setContest] =
    useState<ContestData | null>(null);

  const [problems, setProblems] =
    useState<ContestProblem[]>([]);

  const [leaderboard, setLeaderboard] =
    useState<LeaderboardEntry[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [loadingProblems, setLoadingProblems] =
    useState(false);

  const [loadingLeaderboard, setLoadingLeaderboard] =
    useState(false);

  const [isRegistered, setIsRegistered] =
    useState(false);

  const [registering, setRegistering] =
    useState(false);

  const [isParticipating, setIsParticipating] =
    useState(false);

  const [enteringContest, setEnteringContest] =
    useState(false);

  const [certificate, setCertificate] =
    useState<CertificateResponse | null>(null);

  const [loadingCertificate, setLoadingCertificate] =
    useState(false);

  const [downloadingCertificate, setDownloadingCertificate] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /* =========================================================
     CONTEST ID
  ========================================================= */

  const contestId = id ? Number(id) : NaN;

  /* =========================================================
     LOAD CONTEST
  ========================================================= */

  const loadContest = useCallback(
    async (showLoader = true) => {
      if (!id) {
        setError("Contest ID is missing.");
        setLoading(false);
        return null;
      }

      const parsedId = Number(id);

      if (Number.isNaN(parsedId)) {
        setError("Invalid contest ID.");
        setLoading(false);
        return null;
      }

      try {
        if (showLoader) {
          setLoading(true);
        }

        setError(null);

        const contestData =
          await getContestById(parsedId);

        setContest(contestData);

        setIsRegistered(
          Boolean(contestData.registered)
        );

        return contestData;
      } catch (err) {
        console.error(
          "Failed to load contest:",
          err
        );

        setError("Failed to load contest.");

        return null;
      } finally {
        if (showLoader) {
          setLoading(false);
        }
      }
    },
    [id]
  );

  /* =========================================================
     LOAD PROBLEMS
  ========================================================= */

  const loadProblems = useCallback(
    async () => {
      if (!id || Number.isNaN(contestId)) {
        return;
      }

      try {
        setLoadingProblems(true);

        const data =
          await getContestProblems(
            contestId
          );

        setProblems(data ?? []);
      } catch (err) {
        console.error(
          "Failed to load contest problems:",
          err
        );

        setProblems([]);

        toast.error(
          "Failed to load contest problems"
        );
      } finally {
        setLoadingProblems(false);
      }
    },
    [id, contestId]
  );

  /* =========================================================
     LOAD LEADERBOARD
  ========================================================= */

  const loadLeaderboard = useCallback(
    async () => {
      if (!id || Number.isNaN(contestId)) {
        return;
      }

      try {
        setLoadingLeaderboard(true);

        const data =
          await getContestLeaderboard(
            contestId
          );

        setLeaderboard(data ?? []);
      } catch (err) {
        console.error(
          "Failed to load leaderboard:",
          err
        );

        setLeaderboard([]);
      } finally {
        setLoadingLeaderboard(false);
      }
    },
    [id, contestId]
  );

  /* =========================================================
     LOAD PARTICIPATION
  ========================================================= */

  const loadMyParticipation = useCallback(
    async () => {
      if (!id || Number.isNaN(contestId)) {
        return;
      }

      try {
        await getMyParticipation(
          contestId
        );

        setIsParticipating(true);
      } catch (err: any) {
        const status =
          err?.response?.status;

        if (status === 404) {
          setIsParticipating(false);
          return;
        }

        console.error(
          "Failed to load participation:",
          err
        );
      }
    },
    [id, contestId]
  );

  /* =========================================================
     LOAD CERTIFICATE
  ========================================================= */

  const loadCertificate = useCallback(
    async () => {
      if (!id || Number.isNaN(contestId)) {
        return;
      }

      try {
        setLoadingCertificate(true);

        const data =
          await getMyContestCertificate(
            contestId
          );

        setCertificate(data);
      } catch (err: any) {
        const status =
          err?.response?.status;

        if (status === 404) {
          setCertificate(null);
        } else {
          console.error(
            "Failed to load certificate:",
            err
          );

          setCertificate(null);
        }
      } finally {
        setLoadingCertificate(false);
      }
    },
    [id, contestId]
  );

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    const loadPage = async () => {
      const contestData =
        await loadContest();

      if (!contestData) {
        return;
      }

      await Promise.all([
        loadProblems(),
        loadLeaderboard(),
        loadMyParticipation(),
      ]);
    };

    loadPage();
  }, [
    loadContest,
    loadProblems,
    loadLeaderboard,
    loadMyParticipation,
  ]);

  /* =========================================================
     LOAD CERTIFICATE AFTER CONTEST ENDS
  ========================================================= */

  useEffect(() => {
    if (contest?.status === "ENDED") {
      loadCertificate();
    } else {
      setCertificate(null);
    }
  }, [
    contest?.status,
    loadCertificate,
  ]);

  /* =========================================================
     REFRESH ACTIVE CONTEST
  ========================================================= */

  useEffect(() => {
    if (
      !contest ||
      contest.status === "ENDED" ||
      contest.status === "CANCELLED"
    ) {
      return;
    }

    const interval =
      window.setInterval(
        async () => {
          const updatedContest =
            await loadContest(false);

          if (
            updatedContest?.status ===
            "RUNNING"
          ) {
            await loadLeaderboard();
          }
        },
        30000
      );

    return () => {
      window.clearInterval(interval);
    };
  }, [
    contest?.status,
    loadContest,
    loadLeaderboard,
  ]);

  /* =========================================================
     REGISTER
  ========================================================= */

  const handleRegister = async () => {
    if (
      !id ||
      Number.isNaN(contestId) ||
      isRegistered ||
      registering
    ) {
      return;
    }

    try {
      setRegistering(true);

      await registerForContest(
        contestId
      );

      const updatedContest =
        await getContestById(
          contestId
        );

      setContest(updatedContest);

      setIsRegistered(true);

      toast.success(
        "Successfully registered for contest"
      );
    } catch (err: any) {
      console.error(
        "Registration failed:",
        err
      );

      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        "";

      const normalizedMessage =
        String(message).toLowerCase();

      if (
        normalizedMessage.includes(
          "already registered"
        ) ||
        normalizedMessage.includes(
          "already joined"
        )
      ) {
        setIsRegistered(true);

        toast.info(
          "Already registered"
        );
      } else if (
        normalizedMessage.includes(
          "registration has closed"
        )
      ) {
        toast.error(
          "Registration has closed"
        );
      } else {
        toast.error(
          String(message) ||
            "Registration failed"
        );
      }
    } finally {
      setRegistering(false);
    }
  };

  /* =========================================================
     ENTER CONTEST
  ========================================================= */

  const handleEnterContest = async () => {
    if (!id) {
      toast.error(
        "Contest ID is missing."
      );
      return;
    }

    if (Number.isNaN(contestId)) {
      toast.error(
        "Invalid contest ID."
      );
      return;
    }

    if (!isRegistered) {
      toast.error(
        "Please register for the contest first."
      );
      return;
    }

    if (
      contest?.status !== "RUNNING"
    ) {
      toast.error(
        "The contest is not currently running."
      );
      return;
    }

    if (problems.length === 0) {
      toast.error(
        "No problems are available for this contest."
      );
      return;
    }

    if (enteringContest) {
      return;
    }

    if (isParticipating) {
      navigate(
        `/contests/${contestId}/workspace`
      );
      return;
    }

    try {
      setEnteringContest(true);

      await enterContest(
        contestId
      );

      setIsParticipating(true);

      const updatedContest =
        await getContestById(
          contestId
        );

      setContest(updatedContest);

      toast.success(
        "You have entered the contest."
      );

      navigate(
        `/contests/${contestId}/workspace`
      );
    } catch (err: any) {
      console.error(
        "Failed to enter contest:",
        err
      );

      const status =
        err?.response?.status;

      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        "";

      const normalizedMessage =
        String(message).toLowerCase();

      if (
        status === 409 ||
        normalizedMessage.includes(
          "already"
        )
      ) {
        setIsParticipating(true);

        toast.info(
          "You are already participating."
        );

        navigate(
          `/contests/${contestId}/workspace`
        );

        return;
      }

      toast.error(
        String(message) ||
          "Unable to enter contest."
      );
    } finally {
      setEnteringContest(false);
    }
  };

  /* =========================================================
     SOLVE PROBLEM
  ========================================================= */

  const solveProblem = (
    problem: ContestProblem
  ) => {
    if (!id) {
      return;
    }

    if (!isRegistered) {
      toast.error(
        "Please register for the contest first."
      );
      return;
    }

    if (!isParticipating) {
      toast.error(
        "Please enter the contest first."
      );
      return;
    }

    if (
      contest?.status !== "RUNNING"
    ) {
      toast.error(
        "The contest is not currently running."
      );
      return;
    }

    navigate(
      `/contests/${id}/workspace?problemId=${problem.problemId}`
    );
  };

  /* =========================================================
     DOWNLOAD CERTIFICATE
  ========================================================= */

  const handleDownloadCertificate =
    async () => {
      if (
        !certificate?.id ||
        downloadingCertificate
      ) {
        return;
      }

      try {
        setDownloadingCertificate(true);

        const blob =
          await downloadCertificate(
            certificate.id
          );

        const url =
          window.URL.createObjectURL(
            blob
          );

        const link =
          document.createElement("a");

        link.href = url;

        link.download =
          `${certificate.certificateNumber}.pdf`;

        document.body.appendChild(
          link
        );

        link.click();

        link.remove();

        window.URL.revokeObjectURL(
          url
        );

        toast.success(
          "Certificate downloaded"
        );
      } catch (err) {
        console.error(
          "Certificate download failed:",
          err
        );

        toast.error(
          "Failed to download certificate"
        );
      } finally {
        setDownloadingCertificate(
          false
        );
      }
    };

  /* =========================================================
     CERTIFICATE TITLE
  ========================================================= */

  const getCertificateTitle = () => {
    switch (certificate?.type) {
      case "FIRST_PLACE":
        return "1st Place Certificate";

      case "SECOND_PLACE":
        return "2nd Place Certificate";

      case "THIRD_PLACE":
        return "3rd Place Certificate";

      case "PARTICIPATION":
        return "Participation Certificate";

      default:
        return "Certificate";
    }
  };

  /* =========================================================
     STATUS
  ========================================================= */

  const getStatusStyles = () => {
    switch (contest?.status) {
      case "RUNNING":
        return `
          border-emerald-500/20
          bg-emerald-500/10
          text-emerald-600
          dark:text-emerald-400
        `;

      case "UPCOMING":
        return `
          border-orange-500/20
          bg-orange-500/10
          text-orange-600
          dark:text-orange-400
        `;

      case "CANCELLED":
        return `
          border-red-500/20
          bg-red-500/10
          text-red-600
          dark:text-red-400
        `;

      default:
        return `
          border-slate-200
          bg-slate-100
          text-slate-500
          dark:border-white/10
          dark:bg-white/[0.04]
          dark:text-slate-400
        `;
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div
        className="
          flex
          min-h-[60vh]
          items-center
          justify-center
        "
      >
        <div className="text-center">
          <div
            className="
              mx-auto
              h-7
              w-7
              animate-spin
              rounded-full
              border-2
              border-slate-200
              border-t-orange-500
              dark:border-white/10
              dark:border-t-orange-500
            "
          />

          <p
            className="
              mt-3
              font-mono
              text-[10px]
              uppercase
              tracking-wider
              text-slate-500
            "
          >
            Loading contest...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error || !contest) {
    return (
      <div
        className="
          flex
          min-h-[60vh]
          items-center
          justify-center
        "
      >
        <div
          className="
            w-full
            max-w-md
            rounded-lg
            border
            border-slate-200
            bg-white
            p-8
            text-center
            dark:border-white/10
            dark:bg-[#111113]
          "
        >
          <p
            className="
              font-mono
              text-[10px]
              uppercase
              tracking-wider
              text-orange-500
            "
          >
            // error
          </p>

          <h2
            className="
              mt-2
              text-lg
              font-semibold
              text-slate-900
              dark:text-white
            "
          >
            Unable to load contest
          </h2>

          <p
            className="
              mt-2
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
            {error ||
              "Contest not found."}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="
              mt-5
              rounded-md
              bg-orange-500
              px-4
              py-2.5
              text-xs
              font-semibold
              text-white
              transition-colors
              hover:bg-orange-400
            "
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="w-full pb-12">

      {/* =====================================================
          CONTEST HEADER
      ====================================================== */}

      <section
        className="
          rounded-lg
          border
          border-slate-200
          bg-white
          p-6
          dark:border-white/10
          dark:bg-[#111113]
        "
      >
        <div
          className="
            flex
            flex-col
            gap-5
            lg:flex-row
            lg:items-start
            lg:justify-between
          "
        >
          {/* Header Content */}

          <div className="min-w-0">

            <p
              className="
                mb-2
                font-mono
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.15em]
                text-orange-500
              "
            >
              // contest management
            </p>

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-3
              "
            >
              <h1
                className="
                  text-2xl
                  font-bold
                  tracking-tight
                  text-slate-900
                  dark:text-white
                "
              >
                {contest.title}
              </h1>

              <span
                className={`
                  rounded-md
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

            <p
              className="
                mt-2
                max-w-3xl
                text-sm
                leading-5
                text-slate-500
                dark:text-slate-400
              "
            >
              {contest.description ||
                "No description available."}
            </p>

            {/* Registration State */}

            <div className="mt-4 flex flex-wrap gap-2">
              {isRegistered && (
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-md
                    border
                    border-emerald-500/20
                    bg-emerald-500/10
                    px-2.5
                    py-1
                    font-mono
                    text-[10px]
                    font-semibold
                    text-emerald-600
                    dark:text-emerald-400
                  "
                >
                  <CheckCircle2 size={13} />
                  REGISTERED
                </span>
              )}

              {isParticipating && (
                <span
                  className="
                    rounded-md
                    border
                    border-blue-500/20
                    bg-blue-500/10
                    px-2.5
                    py-1
                    font-mono
                    text-[10px]
                    font-semibold
                    text-blue-600
                    dark:text-blue-400
                  "
                >
                  PARTICIPATING
                </span>
              )}
            </div>
          </div>

          {/* Primary Action */}

          <div className="shrink-0">
            {contest.status === "RUNNING" ? (
              <button
                type="button"
                onClick={handleEnterContest}
                disabled={
                  !isRegistered ||
                  problems.length === 0 ||
                  enteringContest
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-md
                  bg-orange-500
                  px-5
                  py-2.5
                  text-xs
                  font-semibold
                  text-white
                  transition-colors
                  hover:bg-orange-400
                  disabled:cursor-not-allowed
                  disabled:bg-slate-300
                  disabled:text-slate-500
                  dark:disabled:bg-white/10
                  dark:disabled:text-slate-500
                "
              >
                <Code2 size={15} />

                {enteringContest
                  ? "Entering..."
                  : isParticipating
                  ? "Continue Contest"
                  : !isRegistered
                  ? "Register First"
                  : problems.length === 0
                  ? "No Problems"
                  : "Enter Contest"}
              </button>
            ) : contest.status ===
              "UPCOMING" ? (
              <button
                type="button"
                onClick={handleRegister}
                disabled={
                  isRegistered ||
                  registering
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-md
                  bg-orange-500
                  px-5
                  py-2.5
                  text-xs
                  font-semibold
                  text-white
                  transition-colors
                  hover:bg-orange-400
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {isRegistered ? (
                  <>
                    <CheckCircle2 size={15} />
                    Registered
                  </>
                ) : registering ? (
                  "Registering..."
                ) : (
                  "Register Now →"
                )}
              </button>
            ) : contest.status ===
              "CANCELLED" ? (
              <span
                className="
                  inline-flex
                  rounded-md
                  border
                  border-red-500/20
                  bg-red-500/10
                  px-4
                  py-2.5
                  text-xs
                  font-semibold
                  text-red-500
                  dark:text-red-400
                "
              >
                Contest Cancelled
              </span>
            ) : null}
          </div>
        </div>

        {/* =================================================
            CONTEST STATS
        ================================================== */}

        <div
          className="
            mt-6
            grid
            grid-cols-1
            gap-3
            sm:grid-cols-2
            lg:grid-cols-5
          "
        >
          <InfoCard
            icon={<Clock3 size={16} />}
            label="Start Time"
            value={new Date(
              contest.startTime
            ).toLocaleString()}
          />

          <InfoCard
            icon={<Clock3 size={16} />}
            label="End Time"
            value={new Date(
              contest.endTime
            ).toLocaleString()}
          />

          <InfoCard
            label="Duration"
            value={`${contest.durationMinutes} min`}
            highlight
          />

          <InfoCard
            icon={<Code2 size={16} />}
            label="Problems"
            value={String(
              problems.length
            )}
          />

          <InfoCard
            icon={<Users size={16} />}
            label="Participants"
            value={String(
              contest.participantCount ?? 0
            )}
          />
        </div>

        {/* =================================================
            ENDED STATE
        ================================================== */}

        {contest.status === "ENDED" && (
          <div
            className="
              mt-4
              flex
              flex-col
              gap-4
              rounded-md
              border
              border-slate-200
              bg-slate-50
              p-4
              dark:border-white/10
              dark:bg-white/[0.02]
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <p
                className="
                  text-sm
                  font-semibold
                  text-slate-900
                  dark:text-white
                "
              >
                Contest Ended
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-500
                  dark:text-slate-400
                "
              >
                The contest has finished.
              </p>
            </div>

            {certificate && (
              <button
                type="button"
                onClick={
                  handleDownloadCertificate
                }
                disabled={
                  downloadingCertificate
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-md
                  bg-orange-500
                  px-4
                  py-2.5
                  text-xs
                  font-semibold
                  text-white
                  transition-colors
                  hover:bg-orange-400
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                <Download size={15} />

                {downloadingCertificate
                  ? "Generating..."
                  : getCertificateTitle()}
              </button>
            )}

            {loadingCertificate &&
              !certificate && (
                <span
                  className="
                    font-mono
                    text-[10px]
                    text-slate-500
                  "
                >
                  Checking certificate...
                </span>
              )}
          </div>
        )}
      </section>

      {/* =====================================================
          CERTIFICATE
      ====================================================== */}

      {contest.status === "ENDED" &&
        certificate && (
          <section className="mt-6">
            <div
              className="
                rounded-lg
                border
                border-slate-200
                bg-white
                dark:border-white/10
                dark:bg-[#111113]
              "
            >
              <div className="border-l-2 border-orange-500 p-5">
                <div
                  className="
                    flex
                    flex-col
                    gap-5
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                  "
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-md
                        bg-orange-500/10
                        text-orange-500
                      "
                    >
                      {certificate.type ===
                      "FIRST_PLACE" ? (
                        <Trophy size={20} />
                      ) : certificate.type ===
                          "SECOND_PLACE" ||
                        certificate.type ===
                          "THIRD_PLACE" ? (
                        <Medal size={20} />
                      ) : (
                        <Award size={20} />
                      )}
                    </div>

                    <div>
                      <p
                        className="
                          font-mono
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-wider
                          text-orange-500
                        "
                      >
                        // achievement
                      </p>

                      <h2
                        className="
                          mt-1
                          text-base
                          font-semibold
                          text-slate-900
                          dark:text-white
                        "
                      >
                        Certificate Available
                      </h2>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        {getCertificateTitle()}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-4">
                        {certificate.rank && (
                          <span
                            className="
                              font-mono
                              text-[10px]
                              font-medium
                              text-orange-500
                            "
                          >
                            Rank #{certificate.rank}
                          </span>
                        )}

                        <span
                          className="
                            font-mono
                            text-[10px]
                            text-slate-500
                          "
                        >
                          ID:{" "}
                          {
                            certificate.certificateNumber
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={
                      handleDownloadCertificate
                    }
                    disabled={
                      downloadingCertificate
                    }
                    className="
                      inline-flex
                      shrink-0
                      items-center
                      justify-center
                      gap-2
                      rounded-md
                      bg-orange-500
                      px-4
                      py-2.5
                      text-xs
                      font-semibold
                      text-white
                      transition-colors
                      hover:bg-orange-400
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    <Download size={15} />

                    {downloadingCertificate
                      ? "Generating PDF..."
                      : "Download Certificate"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

      {/* =====================================================
          PROBLEMS
      ====================================================== */}

      <section className="mt-6">
        <div
          className="
            overflow-hidden
            rounded-lg
            border
            border-slate-200
            bg-white
            dark:border-white/10
            dark:bg-[#111113]
          "
        >
          {/* Section Header */}

          <div
            className="
              border-b
              border-slate-200
              px-5
              py-4
              dark:border-white/10
            "
          >
            <p
              className="
                font-mono
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.15em]
                text-orange-500
              "
            >
              // contest problems
            </p>

            <div className="mt-1 flex items-center justify-between">
              <h2
                className="
                  flex
                  items-center
                  gap-2
                  text-lg
                  font-semibold
                  tracking-tight
                  text-slate-900
                  dark:text-white
                "
              >
                <Code2
                  size={18}
                  className="text-orange-500"
                />

                Contest Problems
              </h2>

              <span
                className="
                  font-mono
                  text-[10px]
                  text-slate-500
                "
              >
                {problems.length} problems
              </span>
            </div>

            <p
              className="
                mt-1
                text-xs
                text-slate-500
                dark:text-slate-400
              "
            >
              Select a problem to start solving.
            </p>
          </div>

          {/* Problems */}

          {loadingProblems ? (
            <div className="flex justify-center p-10">
              <Spinner />
            </div>
          ) : problems.length === 0 ? (
            <div className="p-10 text-center">
              <Code2
                size={32}
                className="
                  mx-auto
                  text-slate-300
                  dark:text-slate-700
                "
              />

              <h3
                className="
                  mt-3
                  text-sm
                  font-semibold
                  text-slate-900
                  dark:text-white
                "
              >
                No problems available
              </h3>

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-500
                "
              >
                The administrator has not added
                problems to this contest yet.
              </p>
            </div>
          ) : (
            <div
              className="
                divide-y
                divide-slate-200
                dark:divide-white/10
              "
            >
              {problems.map(
                (problem, index) => (
                  <div
                    key={problem.id}
                    className="
                      flex
                      flex-col
                      gap-4
                      px-5
                      py-4
                      transition-colors
                      hover:bg-slate-50
                      dark:hover:bg-white/[0.02]
                      md:flex-row
                      md:items-center
                      md:justify-between
                    "
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-md
                          bg-orange-500/10
                          font-mono
                          text-xs
                          font-semibold
                          text-orange-500
                        "
                      >
                        {String.fromCharCode(
                          65 + index
                        )}
                      </div>

                      <div>
                        <h3
                          className="
                            text-sm
                            font-semibold
                            text-slate-900
                            dark:text-white
                          "
                        >
                          {problem.problemTitle}
                        </h3>

                        <p
                          className="
                            mt-1
                            font-mono
                            text-[10px]
                            text-orange-500
                          "
                        >
                          {problem.points} points
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        solveProblem(problem)
                      }
                      disabled={
                        contest.status !==
                          "RUNNING" ||
                        !isRegistered ||
                        !isParticipating
                      }
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-md
                        border
                        border-orange-500/20
                        bg-orange-500/10
                        px-4
                        py-2
                        text-xs
                        font-semibold
                        text-orange-600
                        transition-colors
                        hover:border-orange-500/30
                        hover:bg-orange-500/15
                        dark:text-orange-400
                        dark:hover:bg-orange-500/20
                        disabled:cursor-not-allowed
                        disabled:border-slate-200
                        disabled:bg-transparent
                        disabled:text-slate-400
                        dark:disabled:border-white/10
                        dark:disabled:text-slate-600
                      "
                    >
                      <Code2 size={14} />
                      Solve
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          LEADERBOARD
      ====================================================== */}

      <section className="mt-6">
        <div className="mb-4">
          <p
            className="
              font-mono
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.15em]
              text-orange-500
            "
          >
            // rankings
          </p>

          <div className="mt-1 flex items-end justify-between">
            <div>
              <h2
                className="
                  text-lg
                  font-semibold
                  tracking-tight
                  text-slate-900
                  dark:text-white
                "
              >
                Leaderboard
              </h2>

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Current contest rankings.
              </p>
            </div>

            <span
              className="
                font-mono
                text-[10px]
                text-slate-500
              "
            >
              {leaderboard.length} ranked
            </span>
          </div>
        </div>

        <div
          className="
            overflow-hidden
            rounded-lg
            border
            border-slate-200
            bg-white
            dark:border-white/10
            dark:bg-[#111113]
          "
        >
          {loadingLeaderboard ? (
            <div className="flex justify-center p-10">
              <Spinner />
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="p-10 text-center">
              <Trophy
                size={32}
                className="
                  mx-auto
                  text-slate-300
                  dark:text-slate-700
                "
              />

              <p
                className="
                  mt-3
                  text-sm
                  font-medium
                  text-slate-700
                  dark:text-slate-300
                "
              >
                No rankings yet
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-500
                "
              >
                Rankings will appear once
                participants start submitting.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead
                  className="
                    bg-slate-50
                    dark:bg-white/[0.02]
                  "
                >
                  <tr>
                    <TableHeader>
                      Rank
                    </TableHeader>

                    <TableHeader>
                      User
                    </TableHeader>

                    <TableHeader>
                      Score
                    </TableHeader>

                    <TableHeader>
                      Solved
                    </TableHeader>
                  </tr>
                </thead>

                <tbody>
                  {leaderboard.map(
                    (entry) => (
                      <tr
                        key={entry.userId}
                        className="
                          border-t
                          border-slate-200
                          transition-colors
                          hover:bg-slate-50
                          dark:border-white/10
                          dark:hover:bg-white/[0.02]
                        "
                      >
                        <td className="px-5 py-3.5">
                          <span
                            className="
                              font-mono
                              text-xs
                              font-semibold
                              text-orange-500
                            "
                          >
                            #{entry.rank}
                          </span>
                        </td>

                        <td
                          className="
                            px-5
                            py-3.5
                            text-sm
                            font-medium
                            text-slate-700
                            dark:text-slate-300
                          "
                        >
                          {entry.fullName}
                        </td>

                        <td
                          className="
                            px-5
                            py-3.5
                            font-mono
                            text-xs
                            text-slate-700
                            dark:text-slate-300
                          "
                        >
                          {entry.score}
                        </td>

                        <td
                          className="
                            px-5
                            py-3.5
                            font-mono
                            text-xs
                            text-slate-700
                            dark:text-slate-300
                          "
                        >
                          {entry.solvedCount}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

/* =========================================================
   INFO CARD
========================================================= */

const InfoCard = ({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon?: ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) => {
  return (
    <div
      className="
        rounded-md
        border
        border-slate-200
        bg-slate-50
        p-4
        dark:border-white/10
        dark:bg-white/[0.02]
      "
    >
      <div className="flex items-center gap-2">
        {icon && (
          <span
            className="
              text-slate-400
              dark:text-slate-500
            "
          >
            {icon}
          </span>
        )}

        <p
          className="
            font-mono
            text-[10px]
            font-semibold
            uppercase
            tracking-wider
            text-slate-500
          "
        >
          {label}
        </p>
      </div>

      <p
        className={`
          mt-2
          text-sm
          font-semibold
          ${
            highlight
              ? "text-orange-500 dark:text-orange-400"
              : "text-slate-800 dark:text-slate-200"
          }
        `}
      >
        {value}
      </p>
    </div>
  );
};

/* =========================================================
   SPINNER
========================================================= */

const Spinner = () => {
  return (
    <div
      className="
        h-7
        w-7
        animate-spin
        rounded-full
        border-2
        border-slate-200
        border-t-orange-500
        dark:border-white/10
        dark:border-t-orange-500
      "
    />
  );
};

/* =========================================================
   TABLE HEADER
========================================================= */

const TableHeader = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <th
      className="
        px-5
        py-3
        text-left
        font-mono
        text-[10px]
        font-semibold
        uppercase
        tracking-wider
        text-slate-500
      "
    >
      {children}
    </th>
  );
};

export default ContestDetailsPage;