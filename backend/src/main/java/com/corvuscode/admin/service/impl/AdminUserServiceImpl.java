package com.corvuscode.admin.service.impl;

import com.corvuscode.admin.dto.UserSummaryResponse;
import com.corvuscode.admin.service.AdminUserService;
import com.corvuscode.auth.entity.Role;
import com.corvuscode.auth.entity.User;
import com.corvuscode.auth.repository.RoleRepository;
import com.corvuscode.auth.repository.UserRepository;
import com.corvuscode.profile.dto.ProfileResponse;
import com.corvuscode.profile.service.ProfileService;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl
        implements AdminUserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ProfileService profileService;

    @Override
    public ProfileResponse getUserProfile(Long userId) {

        return profileService.getProfileByUserId(userId);
    }

    @Override
    public Page<UserSummaryResponse> getUsers(
            int page,
            int size
    ) {

        return userRepository
                .findAll(PageRequest.of(page, size))
                .map(this::mapToResponse);
    }

    private UserSummaryResponse mapToResponse(
            User user
    ) {

        return UserSummaryResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .country(user.getCountry())
                .rating(user.getRating())
                .totalSolved(user.getTotalSolved())
                .enabled(user.getEnabled())
                .createdAt(user.getCreatedAt())
                .roles(
                        user.getRoles()
                                .stream()
                                .map(role -> role.getName())
                                .collect(Collectors.toSet())
                )
                .build();
    }

    @Override
    public void enableUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow();

        user.setEnabled(true);

        userRepository.save(user);
    }

    @Override
    public void disableUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow();

        user.setEnabled(false);

        userRepository.save(user);
    }

    @Override
    @Transactional
    public void grantAdmin(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Role adminRole = roleRepository
                .findByName("ROLE_ADMIN")
                .orElseThrow(() ->
                        new RuntimeException("ROLE_ADMIN not found"));

        user.getRoles().add(adminRole);

        userRepository.save(user);
    }

    @Override
    @Transactional
    public void removeAdmin(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Role adminRole = roleRepository
                .findByName("ROLE_ADMIN")
                .orElseThrow(() ->
                        new RuntimeException("ROLE_ADMIN not found"));

        if (!user.getRoles().contains(adminRole)) {
            throw new RuntimeException("User is not an admin");
        }

        long adminCount = userRepository.findAll()
                .stream()
                .filter(u -> u.getRoles()
                        .stream()
                        .anyMatch(r -> r.getName().equals("ROLE_ADMIN")))
                .count();

        if (adminCount <= 1) {
            throw new RuntimeException(
                    "Cannot remove the last admin"
            );
        }

        user.getRoles().remove(adminRole);

        userRepository.save(user);
    }
}