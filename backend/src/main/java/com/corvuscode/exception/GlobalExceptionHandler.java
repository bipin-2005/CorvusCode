package com.corvuscode.exception;

import com.corvuscode.problem.startercode.exception.StarterCodeAlreadyExistsException;
import com.corvuscode.problem.startercode.exception.StarterCodeNotFoundException;
import com.corvuscode.problem.testcase.exception.TestCaseNotFoundException;
import com.corvuscode.profile.exception.InvalidCurrentPasswordException;
import com.corvuscode.profile.exception.UserNotFoundException;
import com.corvuscode.submission.exception.SubmissionNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // =========================
    // Problem Exceptions
    // =========================

    @ExceptionHandler(ProblemNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleProblemNotFoundException(
            ProblemNotFoundException ex) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of(
                        "message", ex.getMessage()
                ));
    }

    @ExceptionHandler(ProblemExampleNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleProblemExampleNotFoundException(
            ProblemExampleNotFoundException ex) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of(
                        "message", ex.getMessage()
                ));
    }

    // =========================
    // Validation Exception
    // =========================

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationException(
            MethodArgumentNotValidException ex) {

        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        "message", message
                ));
    }

    // =========================
    // Runtime Exception
    // =========================

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(
            RuntimeException ex) {

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        "message", ex.getMessage()
                ));
    }

    // =========================
    // Unknown Exception
    // =========================

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(
            Exception ex) {

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                        "message", "Something went wrong."
                ));
    }


    // =========================
    // Tag Exception
    // =========================
    @ExceptionHandler(TagNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleTagNotFoundException(
            TagNotFoundException ex) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of(
                        "message", ex.getMessage()
                ));
    }


    // =========================
    // Tag Already exists Exception
    // =========================
    @ExceptionHandler(TagAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleTagAlreadyExistsException(
            TagAlreadyExistsException ex) {

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(Map.of(
                        "message", ex.getMessage()
                ));
    }



    @ExceptionHandler(StarterCodeNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleStarterCodeNotFound(
            StarterCodeNotFoundException ex) {

        return Map.of(
                "message",
                ex.getMessage()
        );
    }

    @ExceptionHandler(StarterCodeAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String, String> handleStarterCodeAlreadyExists(
            StarterCodeAlreadyExistsException ex) {

        return Map.of(
                "message",
                ex.getMessage()
        );
    }

    @ExceptionHandler(TestCaseNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleTestCaseNotFound(
            TestCaseNotFoundException ex) {

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(SubmissionNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleSubmissionNotFound(
            SubmissionNotFoundException ex) {

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of(
                        "message",
                        ex.getMessage()
                ));
    }

    // =========================
    // Profile Exceptions
    // =========================

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleUserNotFoundException(
            UserNotFoundException ex) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of(
                        "message", ex.getMessage()
                ));
    }

    @ExceptionHandler(InvalidCurrentPasswordException.class)
    public ResponseEntity<Map<String, String>> handleInvalidCurrentPasswordException(
            InvalidCurrentPasswordException ex) {

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        "message", ex.getMessage()
                ));
    }

}