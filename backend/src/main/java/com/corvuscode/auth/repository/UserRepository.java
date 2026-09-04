package com.corvuscode.auth.repository;

import com.corvuscode.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    @Query("""
            SELECT u
            FROM User u
            LEFT JOIN FETCH u.roles
            WHERE u.email = :email
            """)
    Optional<User> findByEmailWithRoles(String email);

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    long countByEnabledTrue();
}