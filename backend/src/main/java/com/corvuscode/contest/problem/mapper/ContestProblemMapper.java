package com.corvuscode.contest.problem.mapper;

import com.corvuscode.contest.problem.dto.response.ContestProblemResponse;
import com.corvuscode.contest.problem.entity.ContestProblem;
import org.springframework.stereotype.Component;

@Component
public class ContestProblemMapper {

    public ContestProblemResponse toResponse(
            ContestProblem contestProblem) {

        return ContestProblemResponse.builder()

                .id(contestProblem.getId())

                .contestId(
                        contestProblem.getContest().getId()
                )

                .problemId(
                        contestProblem.getProblem().getId()
                )

                .problemTitle(
                        contestProblem.getProblem().getTitle()
                )

                .problemSlug(
                        contestProblem.getProblem().getSlug()
                )

                .points(
                        contestProblem.getPoints()
                )

                .displayOrder(
                        contestProblem.getDisplayOrder()
                )

                .build();
    }
}