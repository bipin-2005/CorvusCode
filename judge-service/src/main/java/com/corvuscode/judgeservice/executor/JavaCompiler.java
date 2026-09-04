package com.corvuscode.judgeservice.executor;

import com.corvuscode.judgeservice.dto.ProcessResult;
import org.springframework.stereotype.Component;

import java.nio.file.Path;

@Component
public class JavaCompiler {

    private final DockerExecutor dockerExecutor;
    private final DockerCommandFactory dockerCommandBuilder;

    public JavaCompiler(
            DockerExecutor dockerExecutor,
            DockerCommandFactory dockerCommandBuilder) {

        this.dockerExecutor = dockerExecutor;
        this.dockerCommandBuilder = dockerCommandBuilder;
    }

    public ProcessResult compile(Path directory) {

        return dockerExecutor.execute(

                null,

                dockerCommandBuilder.buildJavaCompileCommand(directory)

        );

    }

}