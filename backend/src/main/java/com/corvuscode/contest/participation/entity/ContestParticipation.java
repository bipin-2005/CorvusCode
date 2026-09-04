package com.corvuscode.contest.participation.entity;

import com.corvuscode.auth.entity.User;
import com.corvuscode.contest.entity.Contest;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "contest_participations",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {
                                "contest_id",
                                "user_id"
                        }
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContestParticipation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "contest_id",
            nullable = false
    )
    private Contest contest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id",
            nullable = false
    )
    private User user;

    @Builder.Default
    @Column(nullable = false)
    private LocalDateTime joinedAt =
            LocalDateTime.now();
}