package com.corvuscode.certificate.dto.response;

import com.corvuscode.certificate.enums.CertificateType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CertificateResponse {

    private Long id;

    private String certificateNumber;

    private String verificationCode;

    private Long userId;

    private String participantName;

    private Long contestId;

    private String contestName;

    private CertificateType type;

    private Integer rank;

    private LocalDateTime issuedAt;

    private String certificateUrl;
}