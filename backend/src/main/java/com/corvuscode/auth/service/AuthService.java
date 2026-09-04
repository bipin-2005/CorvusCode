package com.corvuscode.auth.service;

import com.corvuscode.auth.dto.*;

public interface AuthService {

    void register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

    void verifyEmail(VerifyOtpRequest request);

    void forgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);

}