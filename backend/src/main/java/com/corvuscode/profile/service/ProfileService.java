package com.corvuscode.profile.service;

import com.corvuscode.profile.dto.ChangePasswordRequest;
import com.corvuscode.profile.dto.ProfileResponse;
import com.corvuscode.profile.dto.PublicProfileResponse;
import com.corvuscode.profile.dto.UpdateProfileRequest;

public interface ProfileService {

    ProfileResponse getMyProfile(String email);

    ProfileResponse updateMyProfile(
            String email,
            UpdateProfileRequest request
    );

    void changePassword(
            String email,
            ChangePasswordRequest request
    );

    PublicProfileResponse getPublicProfile(Long userId);

    ProfileResponse getProfileByUserId(Long userId);
}
