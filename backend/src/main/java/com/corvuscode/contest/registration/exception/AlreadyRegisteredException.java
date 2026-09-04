package com.corvuscode.contest.registration.exception;

public class AlreadyRegisteredException extends RuntimeException {

    public AlreadyRegisteredException(Long contestId) {
        super("User is already registered for contest with id: " + contestId);
    }
}