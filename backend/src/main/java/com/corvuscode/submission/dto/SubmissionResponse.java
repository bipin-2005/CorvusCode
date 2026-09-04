package com.corvuscode.submission.dto;

import com.corvuscode.problem.entity.Difficulty;
import com.corvuscode.problem.startercode.enums.ProgrammingLanguage;
import com.corvuscode.submission.enums.SubmissionStatus;
import com.corvuscode.submission.enums.SubmissionType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionResponse {

    private Long id;

    private String sourceCode;

    private ProgrammingLanguage language;

    private SubmissionStatus status;

    private SubmissionType type;

    private Double executionTime;

    private Integer memory;

    private LocalDateTime submittedAt;

    private Long problemId;

    private Long userId;

    private Integer passedTestCases;
    private Integer totalTestCases;
    private String problemTitle;
    private Difficulty problemDifficulty;

}