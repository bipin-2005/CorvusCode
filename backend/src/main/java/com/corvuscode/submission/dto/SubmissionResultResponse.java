package com.corvuscode.submission.dto;

import com.corvuscode.submission.enums.SubmissionStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionResultResponse {

    private Long submissionId;

    private SubmissionStatus status;

    private Double executionTime;

    private Integer memory;

    private String compileOutput;

    private String standardOutput;

    private String standardError;

}