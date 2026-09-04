package com.corvuscode.auth.repository;

import com.corvuscode.auth.entity.EmailVerificationToken;
import com.corvuscode.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Long> {

    Optional<EmailVerificationToken> findByUser(User user);

    Optional<EmailVerificationToken> findByOtp(String otp);

}