package com.corvuscode.problem.testcase.exception;

public class TestCaseNotFoundException extends RuntimeException {

    public TestCaseNotFoundException(Long id) {
        super("Test case not found with ID: " + id);
    }
}