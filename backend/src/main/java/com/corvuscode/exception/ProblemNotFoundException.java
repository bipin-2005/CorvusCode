package com.corvuscode.exception;

public class ProblemNotFoundException extends RuntimeException {

    public ProblemNotFoundException() {
        super("Problem not found.");
    }

    public ProblemNotFoundException(String message) {
        super(message);
    }

    public ProblemNotFoundException(Long id) {
        super("Problem not found with ID: " + id);
    }
}