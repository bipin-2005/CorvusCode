package com.corvuscode.submission.submissionresult.entity;

import com.corvuscode.problem.testcase.entity.TestCase;
import com.corvuscode.submission.entity.Submission;
import com.corvuscode.submission.enums.SubmissionStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "submission_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", nullable = false)
    private Submission submission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_case_id", nullable = false)
    private TestCase testCase;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubmissionStatus status;

    @Column(nullable = false)
    private Boolean passed;

    @Column(columnDefinition = "TEXT")
    private String expectedOutput;

    @Column(columnDefinition = "TEXT")
    private String actualOutput;

    @Column
    private Double executionTime;

    @Column
    private Integer memory;
}