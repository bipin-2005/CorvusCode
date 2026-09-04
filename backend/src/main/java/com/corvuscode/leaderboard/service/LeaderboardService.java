package com.corvuscode.leaderboard.service;

import com.corvuscode.leaderboard.dto.response.LeaderboardResponse;

import java.util.List;

public interface LeaderboardService {

    List<LeaderboardResponse> getLeaderboard();
}