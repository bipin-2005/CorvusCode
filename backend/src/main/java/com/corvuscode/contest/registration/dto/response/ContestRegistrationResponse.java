package com.corvuscode.contest.registration.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ContestRegistrationResponse {

    private Long registrationId;

    private Long contestId;

    private Long userId;

    private LocalDateTime registeredAt;
}