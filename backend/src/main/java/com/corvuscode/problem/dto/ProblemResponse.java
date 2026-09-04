package com.corvuscode.problem.dto;

import com.corvuscode.problem.entity.Difficulty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProblemResponse {

    private Long id;

    private String title;

    private String slug;

    private Difficulty difficulty;

    private String description;

    private String constraints;

    private String inputFormat;

    private String outputFormat;

    private String explanation;

    private Integer timeLimit;

    private Integer memoryLimit;
}