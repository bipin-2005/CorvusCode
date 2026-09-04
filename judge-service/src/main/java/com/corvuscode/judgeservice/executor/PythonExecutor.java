package com.corvuscode.judgeservice.executor;

import com.corvuscode.judgeservice.dto.ProcessResult;
import com.corvuscode.judgeservice.enums.SupportedLanguage;
import com.corvuscode.judgeservice.util.FileManager;
import org.springframework.stereotype.Component;

import java.nio.file.Path;

@Component
public class PythonExecutor implements LanguageExecutor {

    private final FileManager fileManager;
    private final PythonRunner pythonRunner;

    public PythonExecutor(
            FileManager fileManager,
            PythonRunner pythonRunner) {

        this.fileManager = fileManager;
        this.pythonRunner = pythonRunner;
    }

    @Override
    public SupportedLanguage getLanguage() {
        return SupportedLanguage.PYTHON;
    }

    @Override
    public ProcessResult execute(
            String sourceCode,
            String stdin) {

        Path directory = fileManager.createTempDirectory();

        try {

            fileManager.writeSourceFile(
                    directory,
                    "Main.py",
                    sourceCode
            );

            return pythonRunner.run(
                    directory,
                    stdin
            );

        } finally {

            fileManager.deleteDirectory(directory);

        }
    }
}