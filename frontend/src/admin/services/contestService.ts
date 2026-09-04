import api from "@/services/api";

export interface Contest {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  status: string;
  visibility: string;
}

export const contestService = {
  getContests() {
    return api.get("/contests");
  },

  createContest(data: any) {
    return api.post("/contests", data);
  },

  updateContest(id: number, data: any) {
    return api.put(`/contests/${id}`, data);
  },

  deleteContest(id: number) {
    return api.delete(`/contests/${id}`);
  },

  publishContest(id: number) {
    return api.patch(`/contests/${id}/publish`);
  },

  cancelContest(id: number) {
    return api.patch(`/contests/${id}/cancel`);
  },
};