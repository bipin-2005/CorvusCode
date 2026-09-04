package com.corvuscode.judgeservice.executor;

import com.corvuscode.judgeservice.dto.ProcessResult;
import com.corvuscode.judgeservice.util.FileManager;
import org.springframework.stereotype.Component;
import com.corvuscode.judgeservice.enums.SupportedLanguage;

import java.nio.file.Path;

@Component
public class JavaExecutor implements LanguageExecutor {

    private final FileManager fileManager;
    private final JavaCompiler javaCompiler;

    private final JavaRunner javaRunner;

    public JavaExecutor(
            FileManager fileManager,
            JavaCompiler javaCompiler,
            JavaRunner javaRunner) {

        this.fileManager = fileManager;
        this.javaCompiler = javaCompiler;
        this.javaRunner = javaRunner;
    }

    @Override
    public SupportedLanguage getLanguage() {
        return SupportedLanguage.JAVA;
    }

    @Override
    public ProcessResult execute(
            String sourceCode,
            String stdin) {

        Path directory = fileManager.createTempDirectory();

        try {

            fileManager.writeSourceFile(
                    directory,
                    "Main.java",
                    sourceCode
            );

            ProcessResult compileResult =
                    javaCompiler.compile(directory);

            if (compileResult.getExitCode() != 0) {
                return compileResult;
            }

            return javaRunner.run(
                    directory,
                    stdin
            );

        } finally {

            fileManager.deleteDirectory(directory);

        }
    }
}