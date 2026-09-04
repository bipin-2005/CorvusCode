package com.corvuscode.submission.dto;

import com.corvuscode.problem.startercode.enums.ProgrammingLanguage;
import com.corvuscode.submission.enums.SubmissionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionRequest {

    @NotBlank(message = "Source code is required.")
    private String sourceCode;

    @NotNull(message = "Programming language is required.")
    private ProgrammingLanguage language;

    @NotNull(message = "Submission type is required.")
    private SubmissionType type;

    @NotNull(message = "Problem ID is required.")
    private Long problemId;

    private Long contestId;

}