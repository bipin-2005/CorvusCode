package com.corvuscode.judgeservice.executor;

import com.corvuscode.judgeservice.dto.ProcessResult;
import org.springframework.stereotype.Component;

import java.nio.file.Path;

@Component
public class CppCompiler {

    private final DockerExecutor dockerExecutor;
    private final DockerCommandFactory dockerCommandFactory;

    public CppCompiler(
            DockerExecutor dockerExecutor,
            DockerCommandFactory dockerCommandFactory) {

        this.dockerExecutor = dockerExecutor;
        this.dockerCommandFactory = dockerCommandFactory;
    }

    public ProcessResult compile(Path directory) {

        return dockerExecutor.execute(
                null,
                dockerCommandFactory.buildCppCompileCommand(directory)
        );
    }
}