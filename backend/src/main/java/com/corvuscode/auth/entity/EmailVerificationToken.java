package com.corvuscode.auth.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name="email_verification_tokens")
public class EmailVerificationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false,length=6)
    private String otp;

    @Column(name="expires_at",nullable=false)
    private LocalDateTime expiresAt;

    @Column(nullable=false)
    private Boolean verified = false;

    @Column(name="created_at",nullable=false)
    private LocalDateTime createdAt;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @PrePersist
    public void onCreate(){
        createdAt = LocalDateTime.now();
    }
}
