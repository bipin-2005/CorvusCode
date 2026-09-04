package com.corvuscode.problem.dto;

import com.corvuscode.problem.entity.Difficulty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProblemRequest {

    @NotBlank(message = "Title is required.")
    private String title;

    @NotNull(message = "Difficulty is required.")
    private Difficulty difficulty;

    @NotBlank(message = "Description is required.")
    private String description;

    private String constraints;

    private String inputFormat;

    private String outputFormat;

    private String explanation;

    @NotNull(message = "Time limit is required.")
    private Integer timeLimit;

    @NotNull(message = "Memory limit is required.")
    private Integer memoryLimit;
}