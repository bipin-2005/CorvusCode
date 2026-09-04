package com.corvuscode.problem.testcase.dto;

import com.corvuscode.problem.testcase.enums.TestCaseType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestCaseResponse {

    private Long id;

    private String input;

    private String expectedOutput;

    private TestCaseType type;

    private String explanation;

    private Long problemId;
}