package com.corvuscode.problem.repository;

import com.corvuscode.problem.entity.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface ProblemRepository extends JpaRepository<Problem, Long> {

    Optional<Problem> findBySlug(String slug);

    boolean existsBySlug(String slug);
    Page<Problem> findAll(Pageable pageable);

    List<Problem> findByActiveTrue();

    Optional<Problem> findBySlugAndActiveTrue(String slug);
}