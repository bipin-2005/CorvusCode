package com.corvuscode.admin.controller;

import com.corvuscode.admin.dto.AdminProblemResponse;
import com.corvuscode.admin.service.AdminProblemService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/problems")
@RequiredArgsConstructor
public class AdminProblemController {

    private final AdminProblemService adminProblemService;

    @GetMapping
    public ResponseEntity<Page<AdminProblemResponse>>
    getProblems(
            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "20")
            int size
    ) {

        return ResponseEntity.ok(
                adminProblemService.getProblems(
                        page,
                        size
                )
        );
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<Void> activateProblem(
            @PathVariable Long id
    ) {

        adminProblemService.activateProblem(id);

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateProblem(
            @PathVariable Long id
    ) {

        adminProblemService.deactivateProblem(id);

        return ResponseEntity.noContent().build();
    }

}