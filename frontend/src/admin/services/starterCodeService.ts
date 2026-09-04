import api from "@/services/api";

export interface StarterCode {
  id: number;
  language: string;
  templateCode: string;
  problemId: number;
}

export const starterCodeService = {
  getStarterCodes(problemId: number) {
    return api.get<StarterCode[]>(
      `/problems/${problemId}/starter-codes`
    );
  },

  createStarterCode(data: {
    language: string;
    templateCode: string;
    problemId: number;
  }) {
    return api.post(
      "/starter-codes",
      data
    );
  },

  updateStarterCode(
    id: number,
    data: {
      language: string;
      templateCode: string;
      problemId: number;
    }
  ) {
    return api.put(
      `/starter-codes/${id}`,
      data
    );
  },

  deleteStarterCode(id: number) {
    return api.delete(
      `/starter-codes/${id}`
    );
  },
};