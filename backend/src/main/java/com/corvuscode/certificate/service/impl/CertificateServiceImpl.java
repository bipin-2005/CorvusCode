package com.corvuscode.certificate.service.impl;

import com.corvuscode.auth.entity.User;
import com.corvuscode.auth.repository.UserRepository;
import com.corvuscode.certificate.dto.response.CertificateResponse;
import com.corvuscode.certificate.entity.Certificate;
import com.corvuscode.certificate.enums.CertificateType;
import com.corvuscode.certificate.mapper.CertificateMapper;
import com.corvuscode.certificate.repository.CertificateRepository;
import com.corvuscode.certificate.service.CertificatePdfService;
import com.corvuscode.certificate.service.CertificateService;
import com.corvuscode.contest.entity.Contest;
import com.corvuscode.contest.exception.ContestNotFoundException;
import com.corvuscode.contest.leaderboard.dto.response.ContestLeaderboardResponse;
import com.corvuscode.contest.leaderboard.service.ContestLeaderboardService;
import com.corvuscode.contest.participation.entity.ContestParticipation;
import com.corvuscode.contest.participation.repository.ContestParticipationRepository;
import com.corvuscode.contest.repository.ContestRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CertificateServiceImpl
        implements CertificateService {

    private final CertificateRepository certificateRepository;

    private final ContestRepository contestRepository;

    private final UserRepository userRepository;

    private final ContestParticipationRepository
            participationRepository;

    private final ContestLeaderboardService
            leaderboardService;

    private final CertificateMapper certificateMapper;

    private final CertificatePdfService
            certificatePdfService;


    /* =========================================================
       GENERATE ALL CONTEST CERTIFICATES
       ========================================================= */

    @Override
    @Transactional
    public void generateContestCertificates(
            Long contestId
    ) {

        /*
         * Find contest
         */

        Contest contest =
                contestRepository.findById(contestId)
                        .orElseThrow(() ->
                                new ContestNotFoundException(
                                        contestId
                                )
                        );


        /*
         * Get final leaderboard
         */

        List<ContestLeaderboardResponse> leaderboard =
                leaderboardService.getLeaderboard(
                        contestId
                );


        /*
         * Convert leaderboard to:
         *
         * userId -> leaderboard entry
         *
         * This makes lookup fast.
         */

        Map<Long, ContestLeaderboardResponse>
                leaderboardMap =
                leaderboard.stream()
                        .collect(
                                Collectors.toMap(
                                        ContestLeaderboardResponse::getUserId,
                                        entry -> entry
                                )
                        );


        /*
         * Get all contest participants
         */

        List<ContestParticipation> participants =
                participationRepository
                        .findByContestId(contestId);


        /*
         * Generate certificate for every participant
         */

        for (
                ContestParticipation participation :
                participants
        ) {

            User user =
                    participation.getUser();

            Long userId =
                    user.getId();


            /*
             * Prevent duplicate certificates.
             */

            if (
                    certificateRepository
                            .existsByContestIdAndUserId(
                                    contestId,
                                    userId
                            )
            ) {

                continue;
            }


            /*
             * Find user's leaderboard result.
             */

            ContestLeaderboardResponse result =
                    leaderboardMap.get(userId);


            Integer rank = null;

            if (result != null) {

                rank =
                        result.getRank()
                                .intValue();
            }


            /*
             * Determine certificate type.
             */

            CertificateType type =
                    determineCertificateType(
                            rank
                    );


            /*
             * Create certificate entity.
             */

            Certificate certificate =
                    Certificate.builder()
                            .certificateNumber(
                                    generateCertificateNumber()
                            )
                            .verificationCode(
                                    generateVerificationCode()
                            )
                            .user(user)
                            .contest(contest)
                            .type(type)
                            .rank(
                                    isTopThree(rank)
                                            ? rank
                                            : null
                            )
                            .issuedAt(
                                    LocalDateTime.now()
                            )
                            .build();


            /*
             * Save certificate first.
             *
             * The PDF service needs the generated
             * certificate information.
             */

            Certificate savedCertificate =
                    certificateRepository.save(
                            certificate
                    );


            /*
             * Generate PDF.
             */

            try {

                String pdfPath =
                        certificatePdfService
                                .generateCertificatePdf(
                                        savedCertificate
                                );


                /*
                 * Store generated PDF path.
                 */

                savedCertificate
                        .setCertificateUrl(
                                pdfPath
                        );


                certificateRepository.save(
                        savedCertificate
                );


            } catch (IOException e) {

                throw new RuntimeException(
                        "Failed to generate certificate PDF",
                        e
                );
            }
        }
    }


    /* =========================================================
       GENERATE SINGLE CERTIFICATE
       ========================================================= */

    @Override
    @Transactional
    public Certificate generateCertificate(
            Long contestId,
            Long userId,
            Integer rank
    ) {

        /*
         * Prevent duplicate certificate.
         */

        if (
                certificateRepository
                        .existsByContestIdAndUserId(
                                contestId,
                                userId
                        )
        ) {

            throw new IllegalStateException(
                    "Certificate already exists"
            );
        }


        /*
         * Find contest.
         */

        Contest contest =
                contestRepository.findById(contestId)
                        .orElseThrow(() ->
                                new ContestNotFoundException(
                                        contestId
                                )
                        );


        /*
         * Find user.
         */

        User user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        /*
         * Determine certificate type.
         */

        CertificateType type =
                determineCertificateType(
                        rank
                );


        /*
         * Create certificate.
         */

        Certificate certificate =
                Certificate.builder()
                        .certificateNumber(
                                generateCertificateNumber()
                        )
                        .verificationCode(
                                generateVerificationCode()
                        )
                        .user(user)
                        .contest(contest)
                        .type(type)
                        .rank(
                                isTopThree(rank)
                                        ? rank
                                        : null
                        )
                        .issuedAt(
                                LocalDateTime.now()
                        )
                        .build();


        /*
         * Save certificate.
         */

        Certificate savedCertificate =
                certificateRepository.save(
                        certificate
                );


        /*
         * Generate PDF.
         */

        try {

            String pdfPath =
                    certificatePdfService
                            .generateCertificatePdf(
                                    savedCertificate
                            );


            savedCertificate
                    .setCertificateUrl(
                            pdfPath
                    );


            return certificateRepository.save(
                    savedCertificate
            );


        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to generate certificate PDF",
                    e
            );
        }
    }


    /* =========================================================
       DETERMINE CERTIFICATE TYPE
       ========================================================= */

    private CertificateType
    determineCertificateType(
            Integer rank
    ) {

        /*
         * No rank means participation.
         */

        if (rank == null) {

            return CertificateType.PARTICIPATION;
        }


        return switch (rank) {

            case 1 ->
                    CertificateType.FIRST_PLACE;

            case 2 ->
                    CertificateType.SECOND_PLACE;

            case 3 ->
                    CertificateType.THIRD_PLACE;

            default ->
                    CertificateType.PARTICIPATION;
        };
    }


    /* =========================================================
       CHECK TOP THREE
       ========================================================= */

    private boolean isTopThree(
            Integer rank
    ) {

        return rank != null
                && rank >= 1
                && rank <= 3;
    }


    /* =========================================================
       CERTIFICATE NUMBER
       ========================================================= */

    private String generateCertificateNumber() {

        return "CC-"
                + LocalDateTime.now().getYear()
                + "-"
                + UUID.randomUUID()
                .toString()
                .substring(0, 8)
                .toUpperCase();
    }


    /* =========================================================
       VERIFICATION CODE
       ========================================================= */

    private String generateVerificationCode() {

        return UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 12)
                .toUpperCase();
    }


    /* =========================================================
       GET USER CERTIFICATES
       ========================================================= */

    @Override
    @Transactional(readOnly = true)
    public List<CertificateResponse>
    getUserCertificates(
            Long userId
    ) {

        return certificateRepository
                .findByUserId(userId)
                .stream()
                .map(certificateMapper::toResponse)
                .toList();
    }


    /* =========================================================
       GET ALL CONTEST CERTIFICATES
       ========================================================= */

    @Override
    @Transactional(readOnly = true)
    public List<CertificateResponse>
    getContestCertificates(
            Long contestId
    ) {

        return certificateRepository
                .findByContestId(contestId)
                .stream()
                .map(certificateMapper::toResponse)
                .toList();
    }


    /* =========================================================
       GET MY CERTIFICATE FOR A CONTEST
       ========================================================= */

    @Override
    @Transactional(readOnly = true)
    public CertificateResponse
    getMyContestCertificate(
            Long contestId,
            String email
    ) {

        /*
         * Find logged-in user.
         */

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        /*
         * Find certificate belonging to
         * this user for this contest.
         */

        Certificate certificate =
                certificateRepository
                        .findByContestIdAndUserId(
                                contestId,
                                user.getId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Certificate not found"
                                )
                        );


        return certificateMapper.toResponse(
                certificate
        );
    }


    /* =========================================================
       VERIFY CERTIFICATE
       ========================================================= */

    @Override
    @Transactional(readOnly = true)
    public CertificateResponse
    verifyCertificate(
            String verificationCode
    ) {

        Certificate certificate =
                certificateRepository
                        .findByVerificationCode(
                                verificationCode
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Certificate not found"
                                )
                        );


        return certificateMapper.toResponse(
                certificate
        );
    }


    /* =========================================================
       DOWNLOAD CERTIFICATE
       ========================================================= */

    @Override
    @Transactional(readOnly = true)
    public byte[] downloadCertificate(
            Long certificateId
    ) {

        Certificate certificate =
                certificateRepository.findById(
                        certificateId
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Certificate not found"
                        )
                );


        /*
         * Make sure PDF was generated.
         */

        if (
                certificate.getCertificateUrl()
                        == null
        ) {

            throw new RuntimeException(
                    "Certificate PDF has not been generated"
            );
        }


        try {

            Path path =
                    Paths.get(
                            certificate
                                    .getCertificateUrl()
                    );


            /*
             * Make sure file exists.
             */

            if (!Files.exists(path)) {

                throw new RuntimeException(
                        "Certificate PDF file not found"
                );
            }


            return Files.readAllBytes(path);


        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to read certificate PDF",
                    e
            );
        }
    }


    /* =========================================================
       GET MY CERTIFICATES
       ========================================================= */

    @Override
    @Transactional(readOnly = true)
    public List<CertificateResponse>
    getMyCertificates(
            String email
    ) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        return certificateRepository
                .findByUserId(user.getId())
                .stream()
                .map(certificateMapper::toResponse)
                .toList();
    }


    /* =========================================================
       CHECK CERTIFICATE OWNERSHIP
       ========================================================= */

    @Override
    @Transactional(readOnly = true)
    public boolean isCertificateOwnedByUser(
            Long certificateId,
            String email
    ) {

        Certificate certificate =
                certificateRepository.findById(
                        certificateId
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Certificate not found"
                        )
                );


        return certificate
                .getUser()
                .getEmail()
                .equals(email);
    }
}