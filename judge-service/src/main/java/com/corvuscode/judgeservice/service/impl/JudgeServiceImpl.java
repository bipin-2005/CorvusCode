package com.corvuscode.judgeservice.service.impl;

import com.corvuscode.judgeservice.dto.JudgeRequest;
import com.corvuscode.judgeservice.dto.JudgeResponse;
import com.corvuscode.judgeservice.dto.ProcessResult;
import com.corvuscode.judgeservice.executor.LanguageExecutor;
import com.corvuscode.judgeservice.executor.LanguageExecutorFactory;
import com.corvuscode.judgeservice.service.JudgeService;
import com.corvuscode.judgeservice.util.JudgeStatusResolver;
import org.springframework.stereotype.Service;

@Service
public class JudgeServiceImpl implements JudgeService {

    private final LanguageExecutorFactory languageExecutorFactory;
    private final JudgeStatusResolver judgeStatusResolver;

    public JudgeServiceImpl(
            LanguageExecutorFactory languageExecutorFactory,
            JudgeStatusResolver judgeStatusResolver) {

        this.languageExecutorFactory = languageExecutorFactory;
        this.judgeStatusResolver = judgeStatusResolver;
    }

    @Override
    public JudgeResponse execute(JudgeRequest request) {

        LanguageExecutor executor =
                languageExecutorFactory.getExecutor(
                        request.getLanguage()
                );

        ProcessResult result =
                executor.execute(
                        request.getSourceCode(),
                        request.getStdin()
                );

        String status =
                judgeStatusResolver.resolve(
                        result,
                        request.getLanguage()
                );

        return JudgeResponse.builder()
                .status(status)
                .stdout(result.getStdout())
                .stderr(result.getStderr())
                .compileOutput(result.getStderr())
                .executionTime((double) result.getExecutionTime())
                .memory(0)
                .build();
    }
}