package com.corvuscode.problem.testcase.mapper;

import com.corvuscode.problem.testcase.dto.PublicTestCaseResponse;
import com.corvuscode.problem.testcase.dto.TestCaseRequest;
import com.corvuscode.problem.testcase.dto.TestCaseResponse;
import com.corvuscode.problem.testcase.entity.TestCase;
import org.springframework.stereotype.Component;

@Component
public class TestCaseMapper {

    public TestCase toEntity(TestCaseRequest request) {

        return TestCase.builder()
                .input(request.getInput())
                .expectedOutput(request.getExpectedOutput())
                .type(request.getType())
                .explanation(request.getExplanation())
                .build();
    }

    public TestCaseResponse toResponse(TestCase testCase) {

        return TestCaseResponse.builder()
                .id(testCase.getId())
                .input(testCase.getInput())
                .expectedOutput(testCase.getExpectedOutput())
                .type(testCase.getType())
                .explanation(testCase.getExplanation())
                .problemId(testCase.getProblem().getId())
                .build();
    }

    public PublicTestCaseResponse toPublicResponse(TestCase testCase) {

        return PublicTestCaseResponse.builder()
                .input(testCase.getInput())
                .expectedOutput(testCase.getExpectedOutput())
                .explanation(testCase.getExplanation())
                .build();
    }
}