package com.corvuscode.contest.leaderboard.service;

import com.corvuscode.contest.leaderboard.dto.response.ContestLeaderboardResponse;

import java.util.List;

public interface ContestLeaderboardService {

    List<ContestLeaderboardResponse> getLeaderboard(
            Long contestId
    );
}