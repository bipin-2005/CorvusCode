package com.corvuscode.auth.service;

public interface EmailService {

    void sendOtpEmail(String to, String otp);

}