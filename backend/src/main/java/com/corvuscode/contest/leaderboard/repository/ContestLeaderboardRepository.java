package com.corvuscode.contest.leaderboard.repository;

import com.corvuscode.submission.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContestLeaderboardRepository
        extends JpaRepository<Submission, Long> {

    List<Submission> findByContestId(Long contestId);

}