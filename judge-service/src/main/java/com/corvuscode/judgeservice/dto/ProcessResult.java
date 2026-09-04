package com.corvuscode.judgeservice.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcessResult {

    private String stdout;

    private String stderr;

    private int exitCode;

    private long executionTime;

}