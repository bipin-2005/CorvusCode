package com.corvuscode.judgeservice.util;

import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;

@Component
public class FileManager {

    public Path createTempDirectory() {

        try {
            return Files.createTempDirectory("judge-");
        } catch (IOException e) {
            throw new RuntimeException("Failed to create temporary directory", e);
        }

    }

    public Path writeSourceFile(
            Path directory,
            String fileName,
            String sourceCode) {

        try {

            Path sourceFile = directory.resolve(fileName);

            Files.writeString(
                    sourceFile,
                    sourceCode,
                    StandardCharsets.UTF_8,
                    StandardOpenOption.CREATE,
                    StandardOpenOption.TRUNCATE_EXISTING
            );

            return sourceFile;

        } catch (IOException e) {
            throw new RuntimeException("Failed to write source file", e);
        }

    }

    public void deleteDirectory(Path directory) {

        try {

            Files.walk(directory)
                    .sorted((a, b) -> b.compareTo(a))
                    .forEach(path -> {
                        try {
                            Files.deleteIfExists(path);
                        } catch (IOException ignored) {
                        }
                    });

        } catch (IOException ignored) {
        }

    }

}