package com.corvuscode.judgeservice.executor;

import com.corvuscode.judgeservice.config.JudgeProperties;
import org.springframework.stereotype.Component;

import java.nio.file.Path;

@Component
public class DockerCommandFactory {

    private final JudgeProperties judgeProperties;

    public DockerCommandFactory(JudgeProperties judgeProperties) {
        this.judgeProperties = judgeProperties;
    }

    // ===========================
    // JAVA
    // ===========================

    public String[] buildJavaCompileCommand(Path directory) {

        return new String[]{

                "run",

                "--rm",

                "--memory=" + judgeProperties.getLimits().getMemory(),

                "--cpus=" + judgeProperties.getLimits().getCpus(),

                "--network=none",

                "--pids-limit=" + judgeProperties.getLimits().getPids(),

                "-v",
                directory.toAbsolutePath() + ":/app",

                "-w",
                "/app",

                judgeProperties.getDocker().getJavaImage(),

                "javac",

                "Main.java"
        };
    }

    public String[] buildJavaRunCommand(Path directory) {

        return new String[]{

                "run",

                "--rm",

                "-i",

                "--memory=" + judgeProperties.getLimits().getMemory(),

                "--cpus=" + judgeProperties.getLimits().getCpus(),

                "--network=none",

                "--pids-limit=" + judgeProperties.getLimits().getPids(),

                "-v",
                directory.toAbsolutePath() + ":/app",

                "-w",
                "/app",

                judgeProperties.getDocker().getJavaImage(),

                "java",

                "Main"
        };
    }

    // ===========================
    // PYTHON
    // ===========================

    public String[] buildPythonRunCommand(Path directory) {

        return new String[]{

                "run",

                "--rm",

                "-i",

                "--memory=" + judgeProperties.getLimits().getMemory(),

                "--cpus=" + judgeProperties.getLimits().getCpus(),

                "--network=none",

                "--pids-limit=" + judgeProperties.getLimits().getPids(),

                "-v",
                directory.toAbsolutePath() + ":/app",

                "-w",
                "/app",

                judgeProperties.getDocker().getPythonImage(),

                "python3",

                "Main.py"
        };
    }

    // ===========================
    // C++
    // ===========================

    public String[] buildCppCompileCommand(Path directory) {

        return new String[]{

                "run",

                "--rm",

                "--memory=" + judgeProperties.getLimits().getMemory(),

                "--cpus=" + judgeProperties.getLimits().getCpus(),

                "--network=none",

                "--pids-limit=" + judgeProperties.getLimits().getPids(),

                "-v",
                directory.toAbsolutePath() + ":/app",

                "-w",
                "/app",

                judgeProperties.getDocker().getCppImage(),

                "g++",

                "Main.cpp",

                "-o",

                "Main"
        };
    }

    public String[] buildCppRunCommand(Path directory) {

        return new String[]{

                "run",

                "--rm",

                "-i",

                "--memory=" + judgeProperties.getLimits().getMemory(),

                "--cpus=" + judgeProperties.getLimits().getCpus(),

                "--network=none",

                "--pids-limit=" + judgeProperties.getLimits().getPids(),

                "-v",
                directory.toAbsolutePath() + ":/app",

                "-w",
                "/app",

                judgeProperties.getDocker().getCppImage(),

                "./Main"
        };
    }
}