package com.corvuscode.submission.submissionresult.dto;

import lombok.*;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public class SubmissionResultRequest {

        private Long submissionId;

        private Long testCaseId;

    }
