package com.corvuscode.submission.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JudgeResponse {

    private String status;

    private String stdout;

    private String stderr;

    private String compileOutput;

    private Double executionTime;

    private Integer memory;

}