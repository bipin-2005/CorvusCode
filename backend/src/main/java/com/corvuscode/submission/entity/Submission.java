package com.corvuscode.submission.entity;

import com.corvuscode.auth.entity.User;
import com.corvuscode.contest.entity.Contest;
import com.corvuscode.problem.entity.Problem;
import com.corvuscode.problem.startercode.enums.ProgrammingLanguage;
import com.corvuscode.submission.enums.SubmissionStatus;
import com.corvuscode.submission.enums.SubmissionType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "submissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String sourceCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProgrammingLanguage language;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubmissionStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubmissionType type;

    @Column
    private Double executionTime;

    @Column
    private Integer memory;

    @Column
    private Integer passedTestCases;

    @Column
    private Integer totalTestCases;

    @Column(columnDefinition = "TEXT")
    private String compileOutput;

    @Column(columnDefinition = "TEXT")
    private String standardOutput;

    @Column(columnDefinition = "TEXT")
    private String standardError;

    @Builder.Default
    @Column(nullable = false)
    private LocalDateTime submittedAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contest_id")
    private Contest contest;
}