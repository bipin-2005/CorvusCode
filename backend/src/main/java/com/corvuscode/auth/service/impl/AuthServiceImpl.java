package com.corvuscode.auth.service.impl;

import com.corvuscode.auth.dto.*;
import com.corvuscode.auth.entity.EmailVerificationToken;
import com.corvuscode.auth.entity.Role;
import com.corvuscode.auth.entity.User;
import com.corvuscode.auth.repository.EmailVerificationTokenRepository;
import com.corvuscode.auth.repository.RoleRepository;
import com.corvuscode.auth.repository.UserRepository;
import com.corvuscode.auth.service.AuthService;
import com.corvuscode.auth.service.EmailService;
import com.corvuscode.auth.service.OtpService;
import com.corvuscode.security.JwtService;
import com.corvuscode.auth.dto.ForgotPasswordRequest;
import com.corvuscode.auth.dto.ResetPasswordRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class AuthServiceImpl implements AuthService {

    // <-- Add these fields here
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final OtpService otpService;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;


    // <-- Add this constructor here
    public AuthServiceImpl(
            UserRepository userRepository,
            RoleRepository roleRepository,
            OtpService otpService,
            EmailService emailService,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.otpService = otpService;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    @Override
    public void register(RegisterRequest request) {

        //unique email checking
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());

        if (existingUser.isPresent()) {

            User user = existingUser.get();

            if (user.getEnabled()) {
                throw new RuntimeException("Email is already registered.");
            }


            // Update the pending user's details
            user.setFullName(request.getFullName());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setCountry(request.getCountry());

            userRepository.save(user);

            // Generate and send a new OTP
            EmailVerificationToken token = otpService.resendOtp(user);

            emailService.sendOtpEmail(
                    user.getEmail(),
                    token.getOtp()
            );

            return;
        }

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Default role not found."));

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setCountry(request.getCountry());
        user.setEnabled(false);

        user.getRoles().add(userRole);

        userRepository.save(user);

        EmailVerificationToken token = otpService.generateOtp(user);

        emailService.sendOtpEmail(
                user.getEmail(),
                token.getOtp()
        );


    }
    @Transactional(readOnly = true)
    @Override
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found."));

        if (!user.getEnabled()) {
            throw new RuntimeException("Please verify your email before logging in.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password.");
        }

        String token = jwtService.generateToken(user.getEmail());

        return new LoginResponse(
                token,
                user.getFullName(),
                user.getEmail(),
                user.getRoles()
                        .stream()
                        .map(Role::getName)
                        .collect(Collectors.toList())
        );
    }
    @Transactional
    @Override
    public void verifyEmail(VerifyOtpRequest request) {

        otpService.validateOtp(
                request.getEmail(),
                request.getOtp()
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found."));

        user.setEnabled(true);

        userRepository.save(user);

        otpService.markOtpVerified(request.getEmail());
    }

    @Transactional
    @Override
    public void forgotPassword(ForgotPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found."));

        if (!user.getEnabled()) {
            throw new RuntimeException("Please verify your email first.");
        }

        EmailVerificationToken token = otpService.generateOtp(user);

        emailService.sendOtpEmail(
                user.getEmail(),
                token.getOtp()
        );
    }

    @Transactional
    @Override
    public void resetPassword(ResetPasswordRequest request) {

        otpService.validateOtp(
                request.getEmail(),
                request.getOtp()
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found."));

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword())
        );

        userRepository.save(user);

        otpService.markOtpVerified(request.getEmail());
    }


}