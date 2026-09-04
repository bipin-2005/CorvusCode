package com.corvuscode.judgeservice.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "judge")
public class JudgeProperties {

    private Limits limits = new Limits();
    private Docker docker = new Docker();

    @Getter
    @Setter
    public static class Limits {

        private String memory;
        private String cpus;
        private Integer pids;
    }

    @Getter
    @Setter
    public static class Docker {

        private String javaImage;
        private String pythonImage;
        private String cppImage;
    }
}