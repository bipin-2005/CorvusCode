package com.corvuscode.contest.participation.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContestParticipationResponse {

    private Long id;

    private Long contestId;

    private Long userId;

    private LocalDateTime joinedAt;
}