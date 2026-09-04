package com.corvuscode.submission.submissionresult.service;

import com.corvuscode.submission.submissionresult.dto.SubmissionResultResponse;

import java.util.List;

public interface SubmissionResultService {

    SubmissionResultResponse getById(Long id);

    List<SubmissionResultResponse> getBySubmission(Long submissionId);

}