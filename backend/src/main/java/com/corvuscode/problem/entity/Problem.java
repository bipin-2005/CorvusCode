package com.corvuscode.problem.entity;

import com.corvuscode.problem.startercode.entity.StarterCode;
import com.corvuscode.problem.testcase.entity.TestCase;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "problems")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String constraints;

    @Column(columnDefinition = "TEXT")
    private String inputFormat;

    @Column(columnDefinition = "TEXT")
    private String outputFormat;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Builder.Default
    @Column(nullable = false)
    private Integer timeLimit = 1000;

    @Builder.Default
    @Column(nullable = false)
    private Integer memoryLimit = 256;


    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(
            mappedBy = "problem",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<ProblemExample> examples = new ArrayList<>();

    @OneToMany(
            mappedBy = "problem",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<TestCase> testCases = new ArrayList<>();

    @OneToMany(
            mappedBy = "problem",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<StarterCode> starterCodes = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "problem_tags",
            joinColumns = @JoinColumn(name = "problem_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    @Builder.Default
    private List<Tag> tags = new ArrayList<>();

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}