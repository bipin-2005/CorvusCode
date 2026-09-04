import api from "./api";
import type { Contest } from "../types/contest";

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
}

/* =========================================
   GET ALL CONTESTS
========================================= */

export const getAllContests = async (): Promise<
  PageResponse<Contest>
> => {

  const response =
    await api.get("/contests");

  return response.data;
};


/* =========================================
   GET CONTEST BY ID
========================================= */

export const getContestById = async (
  contestId: number
): Promise<Contest> => {

  const response =
    await api.get(
      `/contests/${contestId}`
    );

  return response.data;
};


/* =========================================
   CREATE CONTEST
========================================= */

export const createContest = async (
  data: Partial<Contest>
): Promise<Contest> => {

  const response =
    await api.post(
      "/contests",
      data
    );

  return response.data;
};


/* =========================================
   UPDATE CONTEST
========================================= */

export const updateContest = async (
  contestId: number,
  data: Partial<Contest>
): Promise<Contest> => {

  const response =
    await api.put(
      `/contests/${contestId}`,
      data
    );

  return response.data;
};


/* =========================================
   REGISTER
========================================= */

export const registerForContest = async (
  contestId: number
) => {

  const response =
    await api.post(
      `/contests/${contestId}/registration`
    );

  return response.data;
};


/* =========================================
   ENTER CONTEST
========================================= */

export const enterContest = async (
  contestId: number
) => {

  const response =
    await api.post(
      `/contests/${contestId}/participation/join`
    );

  return response.data;
};


/* =========================================
   MY PARTICIPATION
========================================= */

export const getMyParticipation = async (
  contestId: number
) => {

  const response =
    await api.get(
      `/contests/${contestId}/participation/me`
    );

  return response.data;
};


/* =========================================
   CONTEST PROBLEMS
========================================= */

export const getContestProblems = async (
  contestId: number
) => {

  const response =
    await api.get(
      `/contests/${contestId}/problems`
    );

  return response.data;
};


/* =========================================
   LEADERBOARD
========================================= */

export const getContestLeaderboard = async (
  contestId: number
) => {

  const response =
    await api.get(
      `/contests/${contestId}/leaderboard`
    );

  return response.data;
};


/* =========================================
   SERVICE OBJECT
========================================= */

export const contestService = {
  getAllContests,
  getContestById,
  createContest,
  updateContest,
  registerForContest,
  enterContest,
  getMyParticipation,
  getContestProblems,
  getContestLeaderboard,
};