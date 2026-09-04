package com.corvuscode.problem.service;

import com.corvuscode.problem.dto.ProblemRequest;
import com.corvuscode.problem.dto.ProblemResponse;

import java.util.List;

public interface ProblemService {

    ProblemResponse createProblem(ProblemRequest request);

    List<ProblemResponse> getAllProblems();

    ProblemResponse getProblemBySlug(String slug);

    ProblemResponse updateProblem(Long id, ProblemRequest request);

    void deleteProblem(Long id);
    ProblemResponse getProblemById(Long id);
    void activate(Long id);

    void deactivate(Long id);
}