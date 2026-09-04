package com.corvuscode.judgeservice.executor;

import com.corvuscode.judgeservice.dto.ProcessResult;
import com.corvuscode.judgeservice.enums.SupportedLanguage;
import com.corvuscode.judgeservice.util.FileManager;
import org.springframework.stereotype.Component;

import java.nio.file.Path;

@Component
public class CppExecutor implements LanguageExecutor {

    private final FileManager fileManager;
    private final CppCompiler cppCompiler;
    private final CppRunner cppRunner;

    public CppExecutor(
            FileManager fileManager,
            CppCompiler cppCompiler,
            CppRunner cppRunner) {

        this.fileManager = fileManager;
        this.cppCompiler = cppCompiler;
        this.cppRunner = cppRunner;
    }

    @Override
    public SupportedLanguage getLanguage() {
        return SupportedLanguage.CPP;
    }

    @Override
    public ProcessResult execute(
            String sourceCode,
            String stdin) {

        Path directory = fileManager.createTempDirectory();

        try {

            fileManager.writeSourceFile(
                    directory,
                    "Main.cpp",
                    sourceCode
            );

            ProcessResult compileResult =
                    cppCompiler.compile(directory);

            if (compileResult.getExitCode() != 0) {
                return compileResult;
            }

            return cppRunner.run(
                    directory,
                    stdin
            );

        } finally {

            fileManager.deleteDirectory(directory);

        }
    }
}