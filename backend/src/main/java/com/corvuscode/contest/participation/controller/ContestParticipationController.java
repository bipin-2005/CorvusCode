package com.corvuscode.contest.participation.controller;

import com.corvuscode.contest.participation.dto.response.ContestParticipationResponse;
import com.corvuscode.contest.participation.service.ContestParticipationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contests/{contestId}/participation")
@RequiredArgsConstructor
public class ContestParticipationController {

    private final ContestParticipationService service;

    @PostMapping("/join")
    public ContestParticipationResponse joinContest(
            @PathVariable Long contestId) {

        return service.joinContest(contestId);
    }

    @GetMapping("/me")
    public ContestParticipationResponse getMyParticipation(
            @PathVariable Long contestId) {

        return service.getMyParticipation(contestId);
    }
}