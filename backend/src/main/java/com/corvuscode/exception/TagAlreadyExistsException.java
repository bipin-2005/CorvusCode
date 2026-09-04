package com.corvuscode.exception;

public class TagAlreadyExistsException extends RuntimeException {

    public TagAlreadyExistsException(String message) {
        super(message);
    }
}