package com.corvuscode.admin.service;

import com.corvuscode.admin.dto.UserSummaryResponse;
import com.corvuscode.profile.dto.ProfileResponse;
import org.springframework.data.domain.Page;

public interface AdminUserService {

    Page<UserSummaryResponse> getUsers(
            int page,
            int size
    );

    ProfileResponse getUserProfile(Long userId);

    void enableUser(Long userId);

    void disableUser(Long userId);

    void grantAdmin(Long userId);

    void removeAdmin(Long userId);
}