package com.corvuscode.judgeservice.executor;

import com.corvuscode.judgeservice.dto.ProcessResult;
import com.corvuscode.judgeservice.enums.SupportedLanguage;

public interface LanguageExecutor {

    ProcessResult execute(
            String sourceCode,
            String stdin
    );

    SupportedLanguage getLanguage();
}