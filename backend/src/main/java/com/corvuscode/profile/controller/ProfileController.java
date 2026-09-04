package com.corvuscode.profile.controller;

import com.corvuscode.profile.dto.ChangePasswordRequest;
import com.corvuscode.profile.dto.ProfileResponse;
import com.corvuscode.profile.dto.PublicProfileResponse;
import com.corvuscode.profile.dto.UpdateProfileRequest;
import com.corvuscode.profile.service.ProfileService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    /**
     * Returns the profile of the currently authenticated user.
     * Works for both regular users and admins, since it's
     * resolved from the JWT principal rather than a role.
     */
    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getMyProfile(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                profileService.getMyProfile(authentication.getName())
        );
    }

    @PutMapping("/me")
    public ResponseEntity<ProfileResponse> updateMyProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request
    ) {

        return ResponseEntity.ok(
                profileService.updateMyProfile(
                        authentication.getName(),
                        request
                )
        );
    }

    @PutMapping("/me/password")
    public ResponseEntity<Void> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request
    ) {

        profileService.changePassword(
                authentication.getName(),
                request
        );

        return ResponseEntity.noContent().build();
    }

    /**
     * Public-facing profile of any user (e.g. viewed from a
     * leaderboard or a submission's author link).
     */
    @GetMapping("/{userId}")
    public ResponseEntity<PublicProfileResponse> getPublicProfile(
            @PathVariable Long userId
    ) {

        return ResponseEntity.ok(
                profileService.getPublicProfile(userId)
        );
    }
}
