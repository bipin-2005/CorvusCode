package com.corvuscode.submission.submissionresult.controller;

import com.corvuscode.submission.submissionresult.dto.SubmissionResultResponse;
import com.corvuscode.submission.submissionresult.service.SubmissionResultService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submission-results")
public class SubmissionResultController {

    private final SubmissionResultService service;

    public SubmissionResultController(
            SubmissionResultService service) {

        this.service = service;
    }

    @GetMapping("/{id}")
    public SubmissionResultResponse getById(
            @PathVariable Long id) {

        return service.getById(id);
    }

    @GetMapping("/submission/{submissionId}")
    public List<SubmissionResultResponse> getBySubmission(
            @PathVariable Long submissionId) {

        return service.getBySubmission(submissionId);
    }
}