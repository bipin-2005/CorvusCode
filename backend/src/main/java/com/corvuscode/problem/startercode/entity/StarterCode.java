package com.corvuscode.problem.startercode.entity;

import com.corvuscode.problem.entity.Problem;
import com.corvuscode.problem.startercode.enums.ProgrammingLanguage;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "starter_codes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StarterCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProgrammingLanguage language;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String templateCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;
}