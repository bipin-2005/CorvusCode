package com.corvuscode.contest.participation.repository;

import com.corvuscode.contest.participation.entity.ContestParticipation;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ContestParticipationRepository
        extends JpaRepository<ContestParticipation, Long> {

    boolean existsByContestIdAndUserId(
            Long contestId,
            Long userId
    );

    Optional<ContestParticipation>
    findByContestIdAndUserId(
            Long contestId,
            Long userId
    );

    /*
     * Count actual participants in a contest.
     *
     * This counts rows from:
     * contest_participations
     */
    long countByContestId(
            Long contestId
    );

    /*
     * Get all participants.
     *
     * Used by certificate generation.
     */
    List<ContestParticipation>
    findByContestId(
            Long contestId
    );

    @Transactional
    void deleteByContestId(
            Long contestId
    );
}