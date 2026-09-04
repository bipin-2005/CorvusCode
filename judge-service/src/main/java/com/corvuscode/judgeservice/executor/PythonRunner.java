package com.corvuscode.judgeservice.executor;

import com.corvuscode.judgeservice.dto.ProcessResult;
import org.springframework.stereotype.Component;

import java.nio.file.Path;

@Component
public class PythonRunner {

    private final DockerExecutor dockerExecutor;
    private final DockerCommandFactory dockerCommandFactory;

    public PythonRunner(
            DockerExecutor dockerExecutor,
            DockerCommandFactory dockerCommandFactory) {

        this.dockerExecutor = dockerExecutor;
        this.dockerCommandFactory = dockerCommandFactory;
    }

    public ProcessResult run(
            Path directory,
            String stdin) {

        return dockerExecutor.execute(
                stdin,
                dockerCommandFactory.buildPythonRunCommand(directory)
        );
    }
}