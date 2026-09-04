import api from "./api";

export interface ContestProblem {
  id: number;
  contestId: number;
  problemId: number;
  problemTitle: string;
  problemSlug: string;
  points: number;
  displayOrder: number;

}

export interface AddContestProblemRequest {
  problemId: number;
  points: number;
  displayOrder: number;
}

export interface UpdateContestProblemRequest {
  points: number;
  displayOrder: number;
}

export const getContestProblems = async (
  contestId: number
): Promise<ContestProblem[]> => {
  const response = await api.get(
    `/contests/${contestId}/problems`
  );

  return response.data;
};

export const addProblemToContest = async (
  contestId: number,
  data: AddContestProblemRequest
): Promise<ContestProblem> => {
  const response = await api.post(
    `/contests/${contestId}/problems`,
    data
  );

  return response.data;
};

export const removeProblemFromContest = async (
  contestId: number,
  problemId: number
): Promise<void> => {
  await api.delete(
    `/contests/${contestId}/problems/${problemId}`
  );
};

export const updateContestProblem = async (
  contestId: number,
  problemId: number,
  data: UpdateContestProblemRequest
): Promise<ContestProblem> => {
  const response = await api.put(
    `/contests/${contestId}/problems/${problemId}`,
    data
  );

  return response.data;
};