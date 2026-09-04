package com.corvuscode.submission.submissionresult.dto;

import com.corvuscode.submission.enums.SubmissionStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionResultResponse {

    private Long id;

    private Long submissionId;

    private Long testCaseId;

    private SubmissionStatus status;

    private Boolean passed;

    private String expectedOutput;

    private String actualOutput;

    private Double executionTime;

    private Integer memory;

}