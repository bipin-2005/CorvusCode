package com.corvuscode.problem.mapper;

import com.corvuscode.problem.dto.ProblemRequest;
import com.corvuscode.problem.dto.ProblemResponse;
import com.corvuscode.problem.entity.Problem;

public class ProblemMapper {

    private ProblemMapper() {}

    public static Problem toEntity(ProblemRequest request) {

        return Problem.builder()
                .title(request.getTitle())
                .difficulty(request.getDifficulty())
                .description(request.getDescription())
                .constraints(request.getConstraints())
                .inputFormat(request.getInputFormat())
                .outputFormat(request.getOutputFormat())
                .explanation(request.getExplanation())
                .timeLimit(request.getTimeLimit())
                .memoryLimit(request.getMemoryLimit())
                .build();
    }

    public static ProblemResponse toResponse(Problem problem) {

        return ProblemResponse.builder()
                .id(problem.getId())
                .title(problem.getTitle())
                .slug(problem.getSlug())
                .difficulty(problem.getDifficulty())
                .description(problem.getDescription())
                .constraints(problem.getConstraints())
                .inputFormat(problem.getInputFormat())
                .outputFormat(problem.getOutputFormat())
                .explanation(problem.getExplanation())
                .timeLimit(problem.getTimeLimit())
                .memoryLimit(problem.getMemoryLimit())
                .build();
    }
}