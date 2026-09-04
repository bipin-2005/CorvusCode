package com.corvuscode.profile.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PublicProfileResponse {

    private Long id;

    private String fullName;

    private String bio;

    private String avatarUrl;

    private String country;

    private String githubUrl;

    private String linkedinUrl;

    private String websiteUrl;

    private Integer rating;

    private Integer totalSolved;

    private LocalDateTime createdAt;
}
