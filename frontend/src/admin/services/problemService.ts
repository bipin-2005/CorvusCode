import api from "@/services/api";

export interface AdminProblem {
  id: number;
  title: string;
  slug: string;
  difficulty: string;
  active: boolean;
}

export interface ProblemRequest {
  title: string;
  difficulty: string;
  description: string;
  constraints: string;
  inputFormat: string;
  outputFormat: string;
  explanation: string;
  timeLimit: number;
  memoryLimit: number;
}

export interface ProblemPageResponse {
  content: AdminProblem[];
  totalPages: number;
  totalElements: number;
}

export const problemService = {
  getProblems(page = 0, size = 20) {
    return api.get(
      `/admin/problems?page=${page}&size=${size}`
    );
  },

  activateProblem(id: number) {
    return api.patch(
      `/admin/problems/${id}/activate`
    );
  },

  deactivateProblem(id: number) {
    return api.patch(
      `/admin/problems/${id}/deactivate`
    );
  },

  createProblem(data: ProblemRequest) {
    return api.post("/problems", data);
  },

  updateProblem(
    id: number,
    data: ProblemRequest
  ) {
    return api.put(`/problems/${id}`, data);
  },

  deleteProblem(id: number) {
    return api.delete(`/problems/${id}`);
  },
getProblemById(id: number) {
  return api.get(
    `/problems/id/${id}`
  );
},

updateProblem(
  id: number,
  data: any
) {
  return api.put(
    `/problems/${id}`,
    data
  );
},
deleteProblem(id: number) {
  return api.delete(
    `/problems/${id}`
  );
},
};