import api from "./api";

export interface ProfileData {
  id: number;
  fullName: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  country?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  rating: number;
  totalSolved: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  roles: string[];
}

export interface PublicProfileData {
  id: number;
  fullName: string;
  bio?: string;
  avatarUrl?: string;
  country?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  rating: number;
  totalSolved: number;
  createdAt: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  bio?: string;
  country?: string;
  avatarUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const profileService = {
  getMyProfile() {
    return api.get<ProfileData>("/profile/me");
  },

  updateMyProfile(data: UpdateProfileRequest) {
    return api.put<ProfileData>("/profile/me", data);
  },

  changePassword(data: ChangePasswordRequest) {
    return api.put<void>("/profile/me/password", data);
  },

  getPublicProfile(userId: number) {
    return api.get<PublicProfileData>(`/profile/${userId}`);
  },
};
