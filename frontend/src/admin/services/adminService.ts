import api from "@/services/api";

export interface DashboardStats {
  totalUsers: number;
  verifiedUsers: number;
  totalProblems: number;
  totalContests: number;
  activeContests: number;
  totalSubmissions: number;
  acceptedSubmissions: number;
}

export const adminService = {
  getDashboardStats() {
    return api.get<DashboardStats>(
      "/admin/dashboard"
    );
  },
};