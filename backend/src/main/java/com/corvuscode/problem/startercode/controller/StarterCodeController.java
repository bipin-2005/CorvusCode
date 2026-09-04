package com.corvuscode.problem.startercode.controller;

import com.corvuscode.problem.startercode.dto.StarterCodeRequest;
import com.corvuscode.problem.startercode.dto.StarterCodeResponse;
import com.corvuscode.problem.startercode.service.StarterCodeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class StarterCodeController {

    private final StarterCodeService starterCodeService;

    // Create Starter Code
    @PostMapping("/starter-codes")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public StarterCodeResponse createStarterCode(
            @Valid @RequestBody StarterCodeRequest request) {

        return starterCodeService.create(request);
    }

    // Get All Starter Codes
    @GetMapping("/starter-codes")
    public List<StarterCodeResponse> getAllStarterCodes() {

        return starterCodeService.getAll();
    }

    // Get Starter Code By Id
    @GetMapping("/starter-codes/{id}")
    public StarterCodeResponse getStarterCodeById(
            @PathVariable Long id) {

        return starterCodeService.getById(id);
    }

    // Get Starter Codes For A Problem
    @GetMapping("/problems/{problemId}/starter-codes")
    public List<StarterCodeResponse> getStarterCodesByProblem(
            @PathVariable Long problemId) {

        return starterCodeService.getByProblem(problemId);
    }

    // Update Starter Code
    @PutMapping("/starter-codes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public StarterCodeResponse updateStarterCode(
            @PathVariable Long id,
            @Valid @RequestBody StarterCodeRequest request) {

        return starterCodeService.update(id, request);
    }

    // Delete Starter Code
    @DeleteMapping("/starter-codes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteStarterCode(
            @PathVariable Long id) {

        starterCodeService.delete(id);
    }
}