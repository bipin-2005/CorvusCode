package com.corvuscode.profile.service.impl;

import com.corvuscode.auth.entity.User;
import com.corvuscode.auth.repository.UserRepository;
import com.corvuscode.profile.dto.ChangePasswordRequest;
import com.corvuscode.profile.dto.ProfileResponse;
import com.corvuscode.profile.dto.PublicProfileResponse;
import com.corvuscode.profile.dto.UpdateProfileRequest;
import com.corvuscode.profile.exception.InvalidCurrentPasswordException;
import com.corvuscode.profile.exception.UserNotFoundException;
import com.corvuscode.profile.service.ProfileService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public ProfileResponse getMyProfile(String email) {

        User user = findUserByEmail(email);

        return mapToProfileResponse(user);
    }

    @Override
    @Transactional
    public ProfileResponse updateMyProfile(
            String email,
            UpdateProfileRequest request
    ) {

        User user = findUserByEmail(email);

        user.setFullName(request.getFullName());
        user.setBio(request.getBio());
        user.setCountry(request.getCountry());
        user.setAvatarUrl(request.getAvatarUrl());
        user.setGithubUrl(request.getGithubUrl());
        user.setLinkedinUrl(request.getLinkedinUrl());
        user.setWebsiteUrl(request.getWebsiteUrl());

        userRepository.save(user);

        return mapToProfileResponse(user);
    }

    @Override
    @Transactional
    public void changePassword(
            String email,
            ChangePasswordRequest request
    ) {

        User user = findUserByEmail(email);

        boolean matches = passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword()
        );

        if (!matches) {
            throw new InvalidCurrentPasswordException(
                    "Current password is incorrect."
            );
        }

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword())
        );

        userRepository.save(user);
    }

    @Override
    public PublicProfileResponse getPublicProfile(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found."));

        return mapToPublicProfileResponse(user);
    }

    @Override
    public ProfileResponse getProfileByUserId(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found."));

        return mapToProfileResponse(user);
    }

    private User findUserByEmail(String email) {

        return userRepository.findByEmailWithRoles(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found."));
    }

    private ProfileResponse mapToProfileResponse(User user) {

        return ProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .bio(user.getBio())
                .avatarUrl(user.getAvatarUrl())
                .country(user.getCountry())
                .githubUrl(user.getGithubUrl())
                .linkedinUrl(user.getLinkedinUrl())
                .websiteUrl(user.getWebsiteUrl())
                .rating(user.getRating())
                .totalSolved(user.getTotalSolved())
                .enabled(user.getEnabled())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .roles(
                        user.getRoles()
                                .stream()
                                .map(role -> role.getName())
                                .collect(Collectors.toSet())
                )
                .build();
    }

    private PublicProfileResponse mapToPublicProfileResponse(User user) {

        return PublicProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .bio(user.getBio())
                .avatarUrl(user.getAvatarUrl())
                .country(user.getCountry())
                .githubUrl(user.getGithubUrl())
                .linkedinUrl(user.getLinkedinUrl())
                .websiteUrl(user.getWebsiteUrl())
                .rating(user.getRating())
                .totalSolved(user.getTotalSolved())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
