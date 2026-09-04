package com.corvuscode.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
public class UserSummaryResponse {

    private Long id;

    private String fullName;

    private String email;

    private String country;

    private Integer rating;

    private Integer totalSolved;

    private Boolean enabled;

    private LocalDateTime createdAt;

    private Set<String> roles;
}