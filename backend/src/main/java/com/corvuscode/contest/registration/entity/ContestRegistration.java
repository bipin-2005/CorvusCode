package com.corvuscode.contest.registration.entity;

import com.corvuscode.auth.entity.User;
import com.corvuscode.contest.entity.Contest;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "contest_registrations",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_contest_user",
                        columnNames = {"contest_id", "user_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContestRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "contest_id", nullable = false)
    private Contest contest;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDateTime registeredAt;
}