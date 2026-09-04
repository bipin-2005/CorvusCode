package com.corvuscode.admin.controller;

import com.corvuscode.admin.dto.UserSummaryResponse;
import com.corvuscode.admin.service.AdminUserService;
import com.corvuscode.profile.dto.ProfileResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<Page<UserSummaryResponse>>
    getUsers(
            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "20")
            int size
    ) {

        return ResponseEntity.ok(
                adminUserService.getUsers(
                        page,
                        size
                )
        );
    }

    @GetMapping("/{id}/profile")
    public ResponseEntity<ProfileResponse> getUserProfile(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                adminUserService.getUserProfile(id)
        );
    }

    @PutMapping("/{id}/enable")
    public ResponseEntity<Void> enableUser(
            @PathVariable Long id
    ) {

        adminUserService.enableUser(id);

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/disable")
    public ResponseEntity<Void> disableUser(
            @PathVariable Long id
    ) {

        adminUserService.disableUser(id);

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/grant-admin")
    public ResponseEntity<Void> grantAdmin(
            @PathVariable Long id
    ) {

        adminUserService.grantAdmin(id);

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/remove-admin")
    public ResponseEntity<Void> removeAdmin(
            @PathVariable Long id
    ) {

        adminUserService.removeAdmin(id);

        return ResponseEntity.noContent().build();
    }
}