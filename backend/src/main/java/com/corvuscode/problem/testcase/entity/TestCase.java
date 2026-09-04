package com.corvuscode.problem.testcase.entity;

import com.corvuscode.problem.entity.Problem;
import com.corvuscode.problem.testcase.enums.TestCaseType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "test_cases")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String input;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String expectedOutput;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TestCaseType type;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;
}