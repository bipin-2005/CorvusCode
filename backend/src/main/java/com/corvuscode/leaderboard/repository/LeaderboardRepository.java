package com.corvuscode.leaderboard.repository;

import com.corvuscode.submission.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LeaderboardRepository
        extends JpaRepository<Submission, Long> {

    @Query("""
        SELECT s
        FROM Submission s
        JOIN FETCH s.user
        JOIN FETCH s.problem
    """)
    List<Submission> findAllWithUserAndProblem();
}