package com.corvuscode.contest.problem.controller;

import com.corvuscode.contest.problem.dto.request.AddContestProblemRequest;
import com.corvuscode.contest.problem.dto.response.ContestProblemResponse;
import com.corvuscode.contest.problem.service.ContestProblemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contests/{contestId}/problems")
@RequiredArgsConstructor
public class ContestProblemController {

    private final ContestProblemService contestProblemService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContestProblemResponse addProblemToContest(
            @PathVariable Long contestId,
            @Valid @RequestBody AddContestProblemRequest request) {

        return contestProblemService.addProblemToContest(
                contestId,
                request
        );
    }

    @GetMapping
    public List<ContestProblemResponse> getContestProblems(
            @PathVariable Long contestId) {

        return contestProblemService.getContestProblems(
                contestId
        );
    }

    @DeleteMapping("/{problemId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeProblemFromContest(
            @PathVariable Long contestId,
            @PathVariable Long problemId) {

        contestProblemService.removeProblemFromContest(
                contestId,
                problemId
        );
    }

    @PutMapping("/{problemId}")
    public ContestProblemResponse updateContestProblem(
            @PathVariable Long contestId,
            @PathVariable Long problemId,
            @Valid @RequestBody com.corvuscode.contest.problem.dto.request.UpdateContestProblemRequest request) {

        return contestProblemService.updateContestProblem(
                contestId,
                problemId,
                request
        );
    }
}