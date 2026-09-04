package com.corvuscode.certificate.service;

import com.corvuscode.certificate.entity.Certificate;

import java.io.IOException;

public interface CertificatePdfService {

    String generateCertificatePdf(
            Certificate certificate
    ) throws IOException;
}