import api from "@/services/api";
import type { ProfileData } from "@/services/profile.service";

export interface UserSummary {
  id: number;
  fullName: string;
  email: string;
  country: string;
  rating: number;
  totalSolved: number;
  enabled: boolean;
  createdAt: string;
  roles: string[];
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
}

export const userService = {
  getUsers(page = 0, size = 20) {
    return api.get<PageResponse<UserSummary>>(
      `/admin/users?page=${page}&size=${size}`
    );
  },

  getUserProfile(id: number) {
    return api.get<ProfileData>(`/admin/users/${id}/profile`);
  },

  enableUser(id: number) {
    return api.put(`/admin/users/${id}/enable`);
  },

  disableUser(id: number) {
    return api.put(`/admin/users/${id}/disable`);
  },

  grantAdmin(id: number) {
    return api.patch(`/admin/users/${id}/grant-admin`);
  },

  removeAdmin(id: number) {
    return api.patch(`/admin/users/${id}/remove-admin`);
  },
};