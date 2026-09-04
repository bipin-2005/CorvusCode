package com.corvuscode.contest.entity;

import com.corvuscode.auth.entity.User;
import com.corvuscode.contest.enums.ContestStatus;
import com.corvuscode.contest.enums.ContestVisibility;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "contests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDateTime registrationStart;

    @Column(nullable = false)
    private LocalDateTime registrationEnd;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    @Column(nullable = false)
    private Integer durationMinutes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContestStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContestVisibility visibility;

    @Column(nullable = false)
    private Boolean registrationRequired;

    @Column(nullable = false)
    private Boolean ranked;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Builder.Default
    @Column(nullable = false)
    private Boolean finalized = false;

}