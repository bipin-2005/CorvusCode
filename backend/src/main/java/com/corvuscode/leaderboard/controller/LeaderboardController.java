package com.corvuscode.leaderboard.controller;

import com.corvuscode.leaderboard.dto.response.LeaderboardResponse;
import com.corvuscode.leaderboard.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final LeaderboardService service;

    @GetMapping
    public List<LeaderboardResponse> getLeaderboard() {
        return service.getLeaderboard();
    }
}