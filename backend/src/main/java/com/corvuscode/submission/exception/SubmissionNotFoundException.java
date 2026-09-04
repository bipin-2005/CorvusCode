package com.corvuscode.submission.exception;

public class SubmissionNotFoundException extends RuntimeException {

    public SubmissionNotFoundException() {
        super("Submission not found.");
    }

    public SubmissionNotFoundException(String message) {
        super(message);
    }

    public SubmissionNotFoundException(Long id) {
        super("Submission not found with ID: " + id);
    }

}