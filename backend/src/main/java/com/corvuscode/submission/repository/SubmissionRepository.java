package com.corvuscode.submission.repository;

import com.corvuscode.auth.entity.User;
import com.corvuscode.problem.entity.Problem;
import com.corvuscode.submission.entity.Submission;
import com.corvuscode.submission.enums.SubmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubmissionRepository
        extends JpaRepository<Submission, Long> {

    List<Submission> findByUser(User user);

    List<Submission> findByProblem(Problem problem);

    List<Submission> findByUserAndProblem(
            User user,
            Problem problem
    );

    Optional<Submission> findByIdAndUser(
            Long id,
            User user
    );
    long countByStatus(SubmissionStatus status);

    void deleteByContestId(Long contestId);

    List<Submission> findByContestId(Long contestId);
}