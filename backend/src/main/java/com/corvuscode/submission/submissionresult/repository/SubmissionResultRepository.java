package com.corvuscode.submission.submissionresult.repository;

import com.corvuscode.submission.entity.Submission;
import com.corvuscode.submission.submissionresult.entity.SubmissionResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubmissionResultRepository
        extends JpaRepository<SubmissionResult, Long> {

    List<SubmissionResult> findBySubmission(
            Submission submission
    );

    void deleteBySubmission(
            Submission submission
    );
}