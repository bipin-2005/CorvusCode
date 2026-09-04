package com.corvuscode.admin.controller;

import com.corvuscode.admin.dto.DashboardStatsResponse;
import com.corvuscode.admin.service.AdminDashboardService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    @GetMapping
    public ResponseEntity<DashboardStatsResponse>
    getDashboardStats() {

        return ResponseEntity.ok(
                adminDashboardService.getDashboardStats()
        );
    }
}