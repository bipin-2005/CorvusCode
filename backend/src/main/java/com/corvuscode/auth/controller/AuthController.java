package com.corvuscode.auth.controller;

import com.corvuscode.auth.dto.*;
import com.corvuscode.auth.service.AuthService;
import com.corvuscode.auth.service.OtpService;
import com.corvuscode.auth.dto.ForgotPasswordRequest;
import com.corvuscode.auth.dto.ResetPasswordRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        authService.register(request);

        return ResponseEntity.ok(
                new AuthResponse(
                        "Registration successful. Please verify your email using the OTP."
                )
        );
    }
    @PostMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(
            @Valid @RequestBody VerifyOtpRequest request) {

        authService.verifyEmail(request);

        return ResponseEntity.ok("Email verified successfully.");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        LoginResponse response = authService.login(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        authService.forgotPassword(request);

        return ResponseEntity.ok("OTP sent successfully.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        authService.resetPassword(request);

        return ResponseEntity.ok("Password reset successfully.");
    }




}