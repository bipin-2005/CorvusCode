package com.corvuscode.leaderboard.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaderboardResponse {

    private Long rank;

    private Long userId;

    private String fullName;

    private Integer score;

    private Integer solvedCount;
}