package com.corvuscode.problem.seed;

import com.corvuscode.problem.testcase.enums.TestCaseType;
import lombok.Data;

@Data
public class TestCaseSeedData {

    private String input;
    private String expectedOutput;
    private TestCaseType type;
    private String explanation;
}