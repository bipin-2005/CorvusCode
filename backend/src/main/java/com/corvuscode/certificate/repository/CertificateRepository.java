package com.corvuscode.certificate.repository;

import com.corvuscode.certificate.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CertificateRepository
        extends JpaRepository<Certificate, Long> {

    List<Certificate> findByUserId(
            Long userId
    );

    List<Certificate> findByContestId(
            Long contestId
    );

    Optional<Certificate>
    findByContestIdAndUserId(
            Long contestId,
            Long userId
    );

    Optional<Certificate>
    findByCertificateNumber(
            String certificateNumber
    );

    Optional<Certificate>
    findByVerificationCode(
            String verificationCode
    );

    boolean existsByContestIdAndUserId(
            Long contestId,
            Long userId
    );
}