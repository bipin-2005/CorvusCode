package com.corvuscode.contest.exception;

public class ContestNotFoundException extends RuntimeException {

    public ContestNotFoundException(Long contestId) {
        super("Contest not found with id: " + contestId);
    }
}