package com.corvuscode.contest.repository;

import com.corvuscode.contest.entity.Contest;
import com.corvuscode.contest.enums.ContestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface ContestRepository
        extends JpaRepository<Contest, Long> {

    long countByStatus(ContestStatus status);
    List<Contest> findByEndTimeBeforeAndFinalizedFalse(
            LocalDateTime now
    );
}

