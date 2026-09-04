package com.corvuscode.auth.service;

import com.corvuscode.auth.entity.EmailVerificationToken;
import com.corvuscode.auth.entity.User;

public interface OtpService {

    EmailVerificationToken generateOtp(User user);

    void validateOtp(String email, String otp);

    EmailVerificationToken resendOtp(User user);

    void markOtpVerified(String email);
}