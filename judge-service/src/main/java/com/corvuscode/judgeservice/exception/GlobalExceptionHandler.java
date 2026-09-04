package com.corvuscode.judgeservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DockerExecutionException.class)
    public ResponseEntity<Map<String, String>> handleDockerExecutionException(
            DockerExecutionException ex) {

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                        "message",
                        ex.getMessage()
                ));
    }

    @ExceptionHandler(UnsupportedLanguageException.class)
    public ResponseEntity<Map<String, String>> handleUnsupportedLanguageException(
            UnsupportedLanguageException ex) {

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        "message",
                        ex.getMessage()
                ));
    }

}