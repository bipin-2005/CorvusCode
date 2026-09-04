package com.corvuscode.judgeservice.util;

import com.corvuscode.judgeservice.dto.ProcessResult;
import com.corvuscode.judgeservice.enums.SupportedLanguage;
import org.springframework.stereotype.Component;

@Component
public class JudgeStatusResolver {

    public String resolve(
            ProcessResult result,
            SupportedLanguage language) {

        int exitCode = result.getExitCode();

        String stderr =
                result.getStderr() == null
                        ? ""
                        : result.getStderr();

        // SUCCESS
        if (exitCode == 0) {
            return "SUCCESS";
        }

        // TIME LIMIT
        if (exitCode == 124) {
            return "TIME_LIMIT_EXCEEDED";
        }

        // MEMORY LIMIT
        if (exitCode == 137
                || stderr.contains("OutOfMemoryError")
                || stderr.contains("Java heap space")
                || stderr.contains("OOM")
                || stderr.contains("Killed")) {

            return "MEMORY_LIMIT_EXCEEDED";
        }

        // Docker/Internal errors
        if (exitCode == 125
                || exitCode == 126
                || exitCode == 127) {

            return "INTERNAL_ERROR";
        }

        switch (language) {

            case JAVA:
            case CPP:

                if (stderr.contains("error")) {
                    return "COMPILATION_ERROR";
                }

                return "RUNTIME_ERROR";

            case PYTHON:

                return "RUNTIME_ERROR";

            default:

                return "RUNTIME_ERROR";
        }
    }
}