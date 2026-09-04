package com.corvuscode.submission.service;

import com.corvuscode.submission.dto.SubmissionRequest;
import com.corvuscode.submission.dto.SubmissionResponse;
import com.corvuscode.submission.dto.SubmissionResultResponse;

import java.util.List;

public interface SubmissionService {

    SubmissionResponse createSubmission(SubmissionRequest request);

    SubmissionResponse getSubmissionById(Long id);

    List<SubmissionResponse> getMySubmissions();

    List<SubmissionResponse> getSubmissionsByProblem(Long problemId);

    SubmissionResultResponse getSubmissionResult(Long submissionId);

}