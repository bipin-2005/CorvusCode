package com.corvuscode.problem.testcase.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PublicTestCaseResponse {

    private String input;

    private String expectedOutput;

    private String explanation;
}