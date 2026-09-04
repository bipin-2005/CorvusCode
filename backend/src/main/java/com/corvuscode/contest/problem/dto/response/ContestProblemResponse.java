package com.corvuscode.contest.problem.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ContestProblemResponse {

    private Long id;

    private Long contestId;

    private Long problemId;

    private String problemTitle;

    private String problemSlug;

    private Integer points;

    private Integer displayOrder;
}