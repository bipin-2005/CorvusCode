package com.corvuscode.judgeservice.exception;

public class UnsupportedLanguageException extends RuntimeException {

    public UnsupportedLanguageException(String language) {
        super("Unsupported language: " + language);
    }
}