package com.corvuscode.auth.service.impl;

import com.corvuscode.auth.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Autowired
    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendOtpEmail(String to, String otp) {

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("Verify Your Email • CorvusCode");

            String html = """
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>CorvusCode Verification</title>
                    </head>

                    <body style="
                        margin:0;
                        padding:0;
                        background:#020617;
                        font-family:Arial,sans-serif;
                    ">

                    <table width="100%%" cellpadding="0" cellspacing="0" style="background:#020617;">
                        <tr>
                            <td align="center" style="padding:40px 20px;">

                                <table width="600" cellpadding="0" cellspacing="0"
                                       style="
                                       background:#0f172a;
                                       border:1px solid #1e293b;
                                       border-radius:24px;
                                       overflow:hidden;
                                       ">

                                    <!-- Header -->

                                    <tr>
                                        <td style="padding:36px 40px;">

                                            <div style="
                                                display:inline-block;
                                                padding:8px 14px;
                                                border-radius:999px;
                                                background:#f9731615;
                                                border:1px solid #f9731630;
                                                color:#fb923c;
                                                font-size:11px;
                                                font-weight:700;
                                                letter-spacing:1px;
                                            ">
                                                EMAIL VERIFICATION
                                            </div>

                                            <h1 style="
                                                margin:22px 0 10px;
                                                color:#f8fafc;
                                                font-size:30px;
                                                font-weight:700;
                                            ">
                                                Welcome to CorvusCode
                                            </h1>

                                            <p style="
                                                margin:0;
                                                color:#94a3b8;
                                                font-size:15px;
                                                line-height:1.8;
                                            ">
                                                Use the verification code below to activate
                                                your account and continue your coding journey.
                                            </p>

                                        </td>
                                    </tr>

                                    <!-- OTP Card -->

                                    <tr>
                                        <td style="padding:0 40px;">

                                            <div style="
                                                background:#111827;
                                                border:1px solid #1e293b;
                                                border-radius:18px;
                                                padding:32px;
                                                text-align:center;
                                            ">

                                                <p style="
                                                    margin-top:0;
                                                    margin-bottom:14px;
                                                    color:#64748b;
                                                    font-size:12px;
                                                    letter-spacing:1px;
                                                    text-transform:uppercase;
                                                ">
                                                    One Time Password
                                                </p>

                                                <div style="
                                                    color:#fb923c;
                                                    font-size:42px;
                                                    font-weight:800;
                                                    letter-spacing:12px;
                                                    font-family:'Courier New', monospace;
                                                ">
                                                    %s
                                                </div>

                                            </div>

                                        </td>
                                    </tr>

                                    <!-- Information Section -->

                                    <tr>
                                        <td style="padding:32px 40px;">

                                            <table width="100%%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="
                                                        color:#64748b;
                                                        font-size:13px;
                                                    ">
                                                        OTP Validity
                                                    </td>

                                                    <td align="right" style="
                                                        color:#fb923c;
                                                        font-size:13px;
                                                        font-weight:700;
                                                    ">
                                                        5 Minutes
                                                    </td>
                                                </tr>
                                            </table>

                                            <div style="
                                                margin:24px 0;
                                                border-top:1px solid #1e293b;
                                            "></div>

                                            <p style="
                                                color:#94a3b8;
                                                font-size:14px;
                                                line-height:1.8;
                                                margin:0;
                                            ">
                                                For your security, never share this code with anyone.
                                                CorvusCode will never ask for your OTP.
                                            </p>

                                            <p style="
                                                color:#94a3b8;
                                                font-size:14px;
                                                line-height:1.8;
                                                margin-top:18px;
                                                margin-bottom:0;
                                            ">
                                                If you didn't request this verification,
                                                you can safely ignore this email.
                                            </p>

                                        </td>
                                    </tr>

                                    <!-- Footer -->

                                    <tr>
                                        <td style="
                                            background:#020617;
                                            border-top:1px solid #1e293b;
                                            padding:24px;
                                            text-align:center;
                                        ">

                                            <h3 style="
                                                margin:0;
                                                color:#f8fafc;
                                                font-size:18px;
                                            ">
                                                CorvusCode
                                            </h3>

                                            <p style="
                                                margin:8px 0 0;
                                                color:#64748b;
                                                font-size:13px;
                                            ">
                                                Code • Compete • Conquer
                                            </p>

                                            <p style="
                                                margin:12px 0 0;
                                                color:#475569;
                                                font-size:12px;
                                            ">
                                                © 2026 CorvusCode. All rights reserved.
                                            </p>

                                        </td>
                                    </tr>

                                </table>

                            </td>
                        </tr>
                    </table>

                    </body>
                    </html>
                    """.formatted(otp);

            helper.setText(html, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }
}