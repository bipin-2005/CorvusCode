package com.corvuscode.problem.mapper;

import com.corvuscode.problem.dto.ProblemExampleRequest;
import com.corvuscode.problem.dto.ProblemExampleResponse;
import com.corvuscode.problem.entity.Problem;
import com.corvuscode.problem.entity.ProblemExample;

public class ProblemExampleMapper {

    public static ProblemExample toEntity(
            ProblemExampleRequest request,
            Problem problem
    ) {

        return ProblemExample.builder()
                .input(request.getInput())
                .output(request.getOutput())
                .explanation(request.getExplanation())
                .problem(problem)
                .build();
    }

    public static ProblemExampleResponse toResponse(
            ProblemExample example
    ) {

        return ProblemExampleResponse.builder()
                .id(example.getId())
                .input(example.getInput())
                .output(example.getOutput())
                .explanation(example.getExplanation())
                .build();
    }
}