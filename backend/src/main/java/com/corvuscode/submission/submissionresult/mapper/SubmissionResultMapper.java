package com.corvuscode.submission.submissionresult.mapper;

import com.corvuscode.problem.testcase.entity.TestCase;
import com.corvuscode.submission.entity.Submission;
import com.corvuscode.submission.submissionresult.dto.SubmissionResultRequest;
import com.corvuscode.submission.submissionresult.dto.SubmissionResultResponse;
import com.corvuscode.submission.submissionresult.entity.SubmissionResult;
import org.springframework.stereotype.Component;

@Component
public class SubmissionResultMapper {

    public SubmissionResult toEntity(
            SubmissionResultRequest request,
            Submission submission,
            TestCase testCase) {

        return SubmissionResult.builder()
                .submission(submission)
                .testCase(testCase)
                .build();
    }

    public SubmissionResultResponse toResponse(
            SubmissionResult entity) {

        return SubmissionResultResponse.builder()
                .id(entity.getId())
                .submissionId(entity.getSubmission().getId())
                .testCaseId(entity.getTestCase().getId())
                .status(entity.getStatus())
                .passed(entity.getPassed())
                .expectedOutput(entity.getExpectedOutput())
                .actualOutput(entity.getActualOutput())
                .executionTime(entity.getExecutionTime())
                .memory(entity.getMemory())
                .build();
    }
}