package com.corvuscode.submission.controller;

import com.corvuscode.submission.dto.SubmissionRequest;
import com.corvuscode.submission.dto.SubmissionResponse;
import com.corvuscode.submission.dto.SubmissionResultResponse;
import com.corvuscode.submission.service.SubmissionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    private final SubmissionService submissionService;

    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SubmissionResponse createSubmission(
            @Valid @RequestBody SubmissionRequest request) {

        return submissionService.createSubmission(request);
    }

    @GetMapping("/{id}")
    public SubmissionResponse getSubmissionById(
            @PathVariable Long id) {

        return submissionService.getSubmissionById(id);
    }

    @GetMapping("/me")
    public List<SubmissionResponse> getMySubmissions() {

        return submissionService.getMySubmissions();
    }

    @GetMapping("/problem/{problemId}")
    public List<SubmissionResponse> getSubmissionsByProblem(
            @PathVariable Long problemId) {

        return submissionService.getSubmissionsByProblem(problemId);
    }

    @GetMapping("/{id}/result")
    public SubmissionResultResponse getSubmissionResult(
            @PathVariable Long id) {

        return submissionService.getSubmissionResult(id);
    }

}