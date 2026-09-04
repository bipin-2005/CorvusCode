package com.corvuscode.problem.testcase.controller;

import com.corvuscode.problem.testcase.dto.PublicTestCaseResponse;
import com.corvuscode.problem.testcase.dto.TestCaseRequest;
import com.corvuscode.problem.testcase.dto.TestCaseResponse;
import com.corvuscode.problem.testcase.service.TestCaseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TestCaseController {

    private final TestCaseService service;

    @PostMapping("/test-cases")
    @PreAuthorize("hasRole('ADMIN')")
    public TestCaseResponse create(
            @Valid @RequestBody TestCaseRequest request) {

        return service.create(request);
    }

    @GetMapping("/test-cases")
    public List<TestCaseResponse> getAll() {

        return service.getAll();
    }

    @GetMapping("/test-cases/{id}")
    public TestCaseResponse getById(
            @PathVariable Long id) {

        return service.getById(id);
    }

    @PutMapping("/test-cases/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public TestCaseResponse update(
            @PathVariable Long id,
            @Valid @RequestBody TestCaseRequest request) {

        return service.update(id, request);
    }

    @DeleteMapping("/test-cases/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(
            @PathVariable Long id) {

        service.delete(id);
    }

    @GetMapping("/problems/{problemId}/test-cases/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public List<TestCaseResponse> getAllByProblemAdmin(
            @PathVariable Long problemId) {

        return service.getAllByProblemAdmin(problemId);
    }

    @GetMapping("/problems/{problemId}/test-cases")
    public List<PublicTestCaseResponse> getPublicByProblem(
            @PathVariable Long problemId) {

        return service.getPublicByProblem(problemId);
    }
}