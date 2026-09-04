package com.corvuscode.contest.registration.exception;

public class RegistrationClosedException extends RuntimeException {

    public RegistrationClosedException(Long contestId) {
        super("Registration is currently closed for contest with id: " + contestId);
    }
}