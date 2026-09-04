package com.corvuscode.contest.problem.repository;

import com.corvuscode.contest.problem.entity.ContestProblem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ContestProblemRepository
        extends JpaRepository<ContestProblem, Long> {

    boolean existsByContestIdAndProblemId(
            Long contestId,
            Long problemId
    );

    Optional<ContestProblem> findByContestIdAndProblemId(
            Long contestId,
            Long problemId
    );

    List<ContestProblem> findByContestIdOrderByDisplayOrderAsc(
            Long contestId
    );

    void deleteByContestIdAndProblemId(
            Long contestId,
            Long problemId
    );

    void deleteByContestId(Long contestId);
}