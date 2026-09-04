package com.corvuscode.problem.testcase.service;

import com.corvuscode.problem.testcase.dto.PublicTestCaseResponse;
import com.corvuscode.problem.testcase.dto.TestCaseRequest;
import com.corvuscode.problem.testcase.dto.TestCaseResponse;

import java.util.List;

public interface TestCaseService {

    TestCaseResponse create(TestCaseRequest request);

    List<TestCaseResponse> getAll();

    TestCaseResponse getById(Long id);

    TestCaseResponse update(Long id, TestCaseRequest request);

    void delete(Long id);

    List<TestCaseResponse> getAllByProblemAdmin(Long problemId);

    List<PublicTestCaseResponse> getPublicByProblem(Long problemId);
}