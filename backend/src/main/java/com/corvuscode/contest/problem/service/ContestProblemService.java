package com.corvuscode.contest.problem.service;

import com.corvuscode.contest.problem.dto.request.AddContestProblemRequest;
import com.corvuscode.contest.problem.dto.response.ContestProblemResponse;

import java.util.List;

public interface ContestProblemService {

    ContestProblemResponse addProblemToContest(
            Long contestId,
            AddContestProblemRequest request
    );

    List<ContestProblemResponse> getContestProblems(
            Long contestId
    );

    void removeProblemFromContest(
            Long contestId,
            Long problemId
    );

    ContestProblemResponse updateContestProblem(
            Long contestId,
            Long problemId,
            com.corvuscode.contest.problem.dto.request.UpdateContestProblemRequest request
    );
}