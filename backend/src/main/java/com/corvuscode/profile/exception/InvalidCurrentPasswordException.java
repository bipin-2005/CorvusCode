package com.corvuscode.profile.exception;

public class InvalidCurrentPasswordException extends RuntimeException {

    public InvalidCurrentPasswordException(String message) {
        super(message);
    }
}
