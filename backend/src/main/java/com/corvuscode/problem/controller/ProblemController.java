package com.corvuscode.problem.controller;

import com.corvuscode.common.response.ApiResponse;
import com.corvuscode.problem.dto.ProblemRequest;
import com.corvuscode.problem.dto.ProblemResponse;
import com.corvuscode.problem.service.ProblemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
@RequiredArgsConstructor
public class ProblemController {

    private final ProblemService problemService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProblemResponse>> createProblem(
            @Valid @RequestBody ProblemRequest request) {

        ProblemResponse response = problemService.createProblem(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(
                        true,
                        "Problem created successfully.",
                        response
                ));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProblemResponse>>> getAllProblems() {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Problems fetched successfully.",
                        problemService.getAllProblems()
                )
        );
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<ProblemResponse>> getProblemBySlug(
            @PathVariable String slug) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Problem fetched successfully.",
                        problemService.getProblemBySlug(slug)
                )
        );
    }
    @GetMapping("/id/{id}")
    public ResponseEntity<ApiResponse<ProblemResponse>>
    getProblemById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Problem fetched successfully.",
                        problemService.getProblemById(id)
                )
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProblemResponse>> updateProblem(
            @PathVariable Long id,
            @Valid @RequestBody ProblemRequest request) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Problem updated successfully.",
                        problemService.updateProblem(id, request)
                )
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProblem(
            @PathVariable Long id) {

        problemService.deleteProblem(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Problem deleted successfully.",
                        null
                )
        );
    }
}