package com.corvuscode.contest.registration.repository;

import com.corvuscode.contest.registration.entity.ContestRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContestRegistrationRepository
        extends JpaRepository<ContestRegistration, Long> {

    boolean existsByContestIdAndUserId(
            Long contestId,
            Long userId
    );

    Optional<ContestRegistration> findByContestIdAndUserId(
            Long contestId,
            Long userId
    );

    long countByContestId(Long contestId);

    void deleteByContestId(Long contestId);
}