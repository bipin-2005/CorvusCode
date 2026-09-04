package com.corvuscode.problem.testcase.dto;

import com.corvuscode.problem.testcase.enums.TestCaseType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestCaseRequest {

    @NotBlank(message = "Input is required.")
    private String input;

    @NotBlank(message = "Expected output is required.")
    private String expectedOutput;

    @NotNull(message = "Test case type is required.")
    private TestCaseType type;

    private String explanation;

    @NotNull(message = "Problem ID is required.")
    private Long problemId;
}