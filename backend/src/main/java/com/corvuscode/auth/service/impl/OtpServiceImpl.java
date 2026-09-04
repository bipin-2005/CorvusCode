package com.corvuscode.auth.service.impl;

import com.corvuscode.auth.entity.EmailVerificationToken;
import com.corvuscode.auth.entity.User;
import com.corvuscode.auth.repository.EmailVerificationTokenRepository;
import com.corvuscode.auth.repository.UserRepository;
import com.corvuscode.auth.service.OtpService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class OtpServiceImpl implements OtpService {

    private final EmailVerificationTokenRepository tokenRepository;
    private final UserRepository userRepository;

    private final SecureRandom secureRandom = new SecureRandom();

    public OtpServiceImpl(EmailVerificationTokenRepository tokenRepository,
                          UserRepository userRepository) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
    }
    @Transactional
    @Override
    public EmailVerificationToken generateOtp(User user) {

        EmailVerificationToken token = tokenRepository.findByUser(user)
                .orElseGet(EmailVerificationToken::new);

        String otp = String.valueOf(
                100000 + secureRandom.nextInt(900000)
        );

        token.setUser(user);
        token.setOtp(otp);
        token.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        token.setVerified(false);

        return tokenRepository.save(token);
    }
    @Transactional
    @Override
    public void validateOtp(String email, String otp) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found."));

        EmailVerificationToken token = tokenRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("OTP not found."));

        if (token.getVerified()) {
            throw new RuntimeException("OTP already verified.");
        }

        if (!token.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP.");
        }

        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired.");
        }
    }
    @Transactional
    @Override
    public EmailVerificationToken resendOtp(User user) {
        return generateOtp(user);
    }

    @Transactional
    @Override
    public void markOtpVerified(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found."));

        EmailVerificationToken token = tokenRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("OTP not found."));

        token.setVerified(true);

        tokenRepository.save(token);
    }
}