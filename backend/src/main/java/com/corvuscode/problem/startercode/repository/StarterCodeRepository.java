package com.corvuscode.problem.startercode.repository;

import com.corvuscode.problem.startercode.entity.StarterCode;
import com.corvuscode.problem.startercode.enums.ProgrammingLanguage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StarterCodeRepository extends JpaRepository<StarterCode, Long> {

    List<StarterCode> findByProblemId(Long problemId);

    Optional<StarterCode> findByProblemIdAndLanguage(
            Long problemId,
            ProgrammingLanguage language
    );

    boolean existsByProblemIdAndLanguage(
            Long problemId,
            ProgrammingLanguage language
    );
}