package com.corvuscode.problem.controller;

import com.corvuscode.problem.dto.ProblemExampleRequest;
import com.corvuscode.problem.dto.ProblemExampleResponse;
import com.corvuscode.problem.service.ProblemExampleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
@RequiredArgsConstructor
public class ProblemExampleController {

    private final ProblemExampleService exampleService;

    @PostMapping("/{problemId}/examples")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public ProblemExampleResponse create(
            @PathVariable Long problemId,
            @Valid @RequestBody ProblemExampleRequest request) {

        return exampleService.create(problemId, request);
    }

    @GetMapping("/{problemId}/examples")
    public List<ProblemExampleResponse> getAll(
            @PathVariable Long problemId) {

        return exampleService.getAll(problemId);
    }

    @PutMapping("/examples/{exampleId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ProblemExampleResponse update(
            @PathVariable Long exampleId,
            @Valid @RequestBody ProblemExampleRequest request) {

        return exampleService.update(exampleId, request);
    }

    @DeleteMapping("/examples/{exampleId}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long exampleId) {

        exampleService.delete(exampleId);
    }
}