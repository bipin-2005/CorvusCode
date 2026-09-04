package com.corvuscode.judgeservice.executor;

import com.corvuscode.judgeservice.dto.ProcessResult;
import org.springframework.stereotype.Component;

import java.nio.file.Path;

@Component
public class JavaRunner {

    private final DockerExecutor dockerExecutor;
    private final DockerCommandFactory dockerCommandBuilder;

    public JavaRunner(
            DockerExecutor dockerExecutor,
            DockerCommandFactory dockerCommandBuilder) {

        this.dockerExecutor = dockerExecutor;
        this.dockerCommandBuilder = dockerCommandBuilder;
    }

    public ProcessResult run(
            Path directory,
            String stdin) {

        return dockerExecutor.execute(

                stdin,

                dockerCommandBuilder.buildJavaRunCommand(directory)

        );

    }

}