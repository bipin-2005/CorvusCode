package com.corvuscode.problem.seed;

import com.corvuscode.problem.entity.Difficulty;
import lombok.Data;

import java.util.List;

@Data
public class ProblemSeedData {

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
    private Boolean active;

    private List<String> tags;
    private List<ExampleSeedData> examples;
    private List<TestCaseSeedData> testCases;
    private List<StarterCodeSeedData> starterCodes;
}