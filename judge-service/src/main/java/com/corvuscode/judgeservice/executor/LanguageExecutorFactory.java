package com.corvuscode.judgeservice.executor;

import com.corvuscode.judgeservice.enums.SupportedLanguage;
import com.corvuscode.judgeservice.exception.UnsupportedLanguageException;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class LanguageExecutorFactory {

    private final Map<SupportedLanguage, LanguageExecutor> executors =
            new HashMap<>();

    public LanguageExecutorFactory(
            List<LanguageExecutor> executorList) {

        for (LanguageExecutor executor : executorList) {

            executors.put(
                    executor.getLanguage(),
                    executor
            );
        }
    }

    public LanguageExecutor getExecutor(
            SupportedLanguage language) {

        LanguageExecutor executor =
                executors.get(language);

        if (executor == null) {
            throw new UnsupportedLanguageException(language.name());
        }

        return executor;
    }

}