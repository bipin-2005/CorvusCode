package com.corvuscode.certificate.service;

import com.corvuscode.certificate.dto.response.CertificateResponse;
import com.corvuscode.certificate.entity.Certificate;

import java.util.List;

public interface CertificateService {

    Certificate generateCertificate(
            Long contestId,
            Long userId,
            Integer rank
    );

    void generateContestCertificates(
            Long contestId
    );

    List<CertificateResponse>
    getUserCertificates(
            Long userId
    );

    List<CertificateResponse>
    getContestCertificates(
            Long contestId
    );

    CertificateResponse
    getMyContestCertificate(
            Long contestId,
            String email
    );

    CertificateResponse
    verifyCertificate(
            String verificationCode
    );

    byte[] downloadCertificate(
            Long certificateId
    );

    List<CertificateResponse>
    getMyCertificates(
            String email
    );

    boolean isCertificateOwnedByUser(
            Long certificateId,
            String email
    );
}