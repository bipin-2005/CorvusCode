package com.corvuscode.contest.problem.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddContestProblemRequest {

    @NotNull
    private Long problemId;

    @NotNull
    @Min(1)
    private Integer points;

    @NotNull
    @Min(1)
    private Integer displayOrder;
}