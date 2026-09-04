package com.corvuscode.certificate.mapper;

import com.corvuscode.certificate.dto.response.CertificateResponse;
import com.corvuscode.certificate.entity.Certificate;
import org.springframework.stereotype.Component;

@Component
public class CertificateMapper {

    public CertificateResponse toResponse(
            Certificate certificate
    ) {

        return CertificateResponse.builder()
                .id(certificate.getId())
                .certificateNumber(
                        certificate.getCertificateNumber()
                )
                .verificationCode(
                        certificate.getVerificationCode()
                )
                .userId(
                        certificate.getUser().getId()
                )
                .participantName(
                        certificate.getUser().getFullName()
                )
                .contestId(
                        certificate.getContest().getId()
                )
                .contestName(
                        certificate.getContest().getTitle()
                )
                .type(
                        certificate.getType()
                )
                .rank(
                        certificate.getRank()
                )
                .issuedAt(
                        certificate.getIssuedAt()
                )
                .certificateUrl(
                        certificate.getCertificateUrl()
                )
                .build();
    }
}