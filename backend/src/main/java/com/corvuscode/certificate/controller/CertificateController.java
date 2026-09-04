package com.corvuscode.certificate.controller;

import com.corvuscode.certificate.dto.response.CertificateResponse;
import com.corvuscode.certificate.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;


    /* =========================================================
       GET MY CERTIFICATES
       ========================================================= */

    @GetMapping("/my")
    public ResponseEntity<List<CertificateResponse>>
    getMyCertificates(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                certificateService.getMyCertificates(
                        authentication.getName()
                )
        );
    }


    /* =========================================================
       GET ALL CERTIFICATES FOR CONTEST
       ========================================================= */

    @GetMapping("/contest/{contestId}")
    public ResponseEntity<List<CertificateResponse>>
    getContestCertificates(
            @PathVariable Long contestId
    ) {

        return ResponseEntity.ok(
                certificateService
                        .getContestCertificates(
                                contestId
                        )
        );
    }


    /* =========================================================
       GET MY CERTIFICATE FOR CONTEST
       ========================================================= */

    @GetMapping("/contest/{contestId}/my")
    public ResponseEntity<CertificateResponse>
    getMyContestCertificate(
            @PathVariable Long contestId,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                certificateService
                        .getMyContestCertificate(
                                contestId,
                                authentication.getName()
                        )
        );
    }


    /* =========================================================
       VERIFY CERTIFICATE
       ========================================================= */

    @GetMapping("/verify/{verificationCode}")
    public ResponseEntity<CertificateResponse>
    verifyCertificate(
            @PathVariable String verificationCode
    ) {

        return ResponseEntity.ok(
                certificateService
                        .verifyCertificate(
                                verificationCode
                        )
        );
    }


    /* =========================================================
       DOWNLOAD CERTIFICATE
       ========================================================= */

    @GetMapping("/{certificateId}/download")
    public ResponseEntity<byte[]>
    downloadCertificate(
            @PathVariable Long certificateId,
            Authentication authentication
    ) {

        /*
         * Make sure the logged-in user owns
         * this certificate.
         */

        boolean owned =
                certificateService
                        .isCertificateOwnedByUser(
                                certificateId,
                                authentication.getName()
                        );

        if (!owned) {

            return ResponseEntity
                    .status(403)
                    .build();
        }


        /*
         * Read PDF.
         */

        byte[] pdf =
                certificateService
                        .downloadCertificate(
                                certificateId
                        );


        /*
         * Return PDF.
         */

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"certificate.pdf\""
                )
                .contentType(
                        MediaType.APPLICATION_PDF
                )
                .body(pdf);
    }

}