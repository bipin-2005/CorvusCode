package com.corvuscode.certificate.entity;

import com.corvuscode.auth.entity.User;
import com.corvuscode.certificate.enums.CertificateType;
import com.corvuscode.contest.entity.Contest;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "certificates",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {
                                "certificate_number"
                        }
                ),
                @UniqueConstraint(
                        columnNames = {
                                "verification_code"
                        }
                ),
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
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            name = "certificate_number",
            nullable = false,
            unique = true,
            length = 50
    )
    private String certificateNumber;

    @Column(
            name = "verification_code",
            nullable = false,
            unique = true,
            length = 50
    )
    private String verificationCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id",
            nullable = false
    )
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "contest_id",
            nullable = false
    )
    private Contest contest;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CertificateType type;

    /*
     * Only populated for top-three certificates.
     *
     * FIRST_PLACE  -> 1
     * SECOND_PLACE -> 2
     * THIRD_PLACE  -> 3
     * PARTICIPATION -> null
     */
    private Integer rank;

    @Column(nullable = false)
    private LocalDateTime issuedAt;

    /*
     * Will contain the generated PDF location later.
     */
    private String certificateUrl;
}
