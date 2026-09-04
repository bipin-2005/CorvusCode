package com.corvuscode.judgeservice.exception;

public class DockerExecutionException extends RuntimeException {

    public DockerExecutionException(String message) {
        super(message);
    }

    public DockerExecutionException(String message, Throwable cause) {
        super(message, cause);
    }
}