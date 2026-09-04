package com.corvuscode.contest.leaderboard.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContestLeaderboardResponse {

    private Long rank;

    private Long userId;

    private String fullName;

    private Integer score;

    private Integer solvedCount;

    private LocalDateTime lastAcceptedSubmissionAt;
}