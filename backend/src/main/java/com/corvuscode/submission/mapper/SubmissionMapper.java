package com.corvuscode.submission.mapper;

import com.corvuscode.submission.dto.SubmissionRequest;
import com.corvuscode.submission.dto.SubmissionResponse;
import com.corvuscode.submission.entity.Submission;
import org.springframework.stereotype.Component;

@Component
public class SubmissionMapper {

    public Submission toEntity(SubmissionRequest request) {

        return Submission.builder()
                .sourceCode(request.getSourceCode())
                .language(request.getLanguage())
                .type(request.getType())
                .build();
    }

    public SubmissionResponse toResponse(Submission submission) {

        return SubmissionResponse.builder()
                .id(submission.getId())
                .sourceCode(submission.getSourceCode())
                .language(submission.getLanguage())
                .status(submission.getStatus())
                .type(submission.getType())
                .executionTime(submission.getExecutionTime())
                .memory(submission.getMemory())
                .submittedAt(submission.getSubmittedAt())
                .problemId(submission.getProblem().getId())
                .userId(submission.getUser().getId())
                .passedTestCases(submission.getPassedTestCases())
                .totalTestCases(submission.getTotalTestCases())
                .problemTitle(submission.getProblem().getTitle())
                .problemDifficulty(submission.getProblem().getDifficulty())
                .build();
    }

}