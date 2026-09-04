package com.corvuscode.problem.testcase.repository;

import com.corvuscode.problem.testcase.entity.TestCase;
import com.corvuscode.problem.testcase.enums.TestCaseType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestCaseRepository extends JpaRepository<TestCase, Long> {

    List<TestCase> findByProblemId(Long problemId);

    List<TestCase> findByProblemIdAndType(
            Long problemId,
            TestCaseType type
    );
}