package com.corvuscode.judgeservice.executor;

import com.corvuscode.judgeservice.dto.ProcessResult;
import com.corvuscode.judgeservice.exception.DockerExecutionException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class DockerExecutor {

    @Value("${docker.executable}")
    private String dockerExecutable;

    private final ProcessRunner processRunner;

    public DockerExecutor(ProcessRunner processRunner) {
        this.processRunner = processRunner;
    }

    public ProcessResult execute(String stdin, String... arguments) {

        List<String> command = new ArrayList<>();

        command.add(dockerExecutable);
        command.addAll(Arrays.asList(arguments));

        ProcessBuilder processBuilder = new ProcessBuilder(command);

        try {

            return processRunner.run(processBuilder, stdin);

        } catch (IOException e) {

            throw new DockerExecutionException(
                    "Failed to execute Docker command",
                    e
            );

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new DockerExecutionException(
                    "Docker execution interrupted",
                    e
            );
        }
    }
}