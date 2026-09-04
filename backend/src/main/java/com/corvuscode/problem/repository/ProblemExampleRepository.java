package com.corvuscode.problem.repository;

import com.corvuscode.problem.entity.ProblemExample;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProblemExampleRepository extends JpaRepository<ProblemExample, Long> {

    List<ProblemExample> findByProblemId(Long problemId);
}