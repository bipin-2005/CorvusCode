package com.corvuscode.profile.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
public class ProfileResponse {

    private Long id;

    private String fullName;

    private String email;

    private String bio;

    private String avatarUrl;

    private String country;

    private String githubUrl;

    private String linkedinUrl;

    private String websiteUrl;

    private Integer rating;

    private Integer totalSolved;

    private Boolean enabled;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Set<String> roles;
}
