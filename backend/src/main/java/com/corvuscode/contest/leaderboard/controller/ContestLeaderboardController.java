package com.corvuscode.contest.leaderboard.controller;

import com.corvuscode.contest.leaderboard.dto.response.ContestLeaderboardResponse;
import com.corvuscode.contest.leaderboard.service.ContestLeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contests/{contestId}/leaderboard")
@RequiredArgsConstructor
public class ContestLeaderboardController {

    private final ContestLeaderboardService service;

    @GetMapping
    public List<ContestLeaderboardResponse> getLeaderboard(
            @PathVariable Long contestId) {

        return service.getLeaderboard(contestId);
    }
}