package com.corvuscode.problem.testcase.service.impl;

import com.corvuscode.problem.entity.Problem;
import com.corvuscode.exception.ProblemNotFoundException;
import com.corvuscode.problem.repository.ProblemRepository;
import com.corvuscode.problem.testcase.dto.PublicTestCaseResponse;
import com.corvuscode.problem.testcase.dto.TestCaseRequest;
import com.corvuscode.problem.testcase.dto.TestCaseResponse;
import com.corvuscode.problem.testcase.entity.TestCase;
import com.corvuscode.problem.testcase.enums.TestCaseType;
import com.corvuscode.problem.testcase.exception.TestCaseNotFoundException;
import com.corvuscode.problem.testcase.mapper.TestCaseMapper;
import com.corvuscode.problem.testcase.repository.TestCaseRepository;
import com.corvuscode.problem.testcase.service.TestCaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TestCaseServiceImpl implements TestCaseService {

    private final TestCaseRepository repository;
    private final ProblemRepository problemRepository;
    private final TestCaseMapper mapper;

    @Override
    public TestCaseResponse create(TestCaseRequest request) {

        Problem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() -> new ProblemNotFoundException(request.getProblemId()));

        TestCase testCase = mapper.toEntity(request);
        testCase.setProblem(problem);

        TestCase savedTestCase = repository.save(testCase);

        return mapper.toResponse(savedTestCase);
    }

    @Override
    public List<TestCaseResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public TestCaseResponse getById(Long id) {

        TestCase testCase = repository.findById(id)
                .orElseThrow(() -> new TestCaseNotFoundException(id));

        return mapper.toResponse(testCase);
    }

    @Override
    public TestCaseResponse update(Long id, TestCaseRequest request) {

        TestCase testCase = repository.findById(id)
                .orElseThrow(() -> new TestCaseNotFoundException(id));

        Problem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() -> new ProblemNotFoundException(request.getProblemId()));

        testCase.setInput(request.getInput());
        testCase.setExpectedOutput(request.getExpectedOutput());
        testCase.setType(request.getType());
        testCase.setExplanation(request.getExplanation());
        testCase.setProblem(problem);

        TestCase updatedTestCase = repository.save(testCase);

        return mapper.toResponse(updatedTestCase);
    }

    @Override
    public void delete(Long id) {

        TestCase testCase = repository.findById(id)
                .orElseThrow(() -> new TestCaseNotFoundException(id));

        repository.delete(testCase);
    }

    @Override
    public List<TestCaseResponse> getAllByProblemAdmin(Long problemId) {

        return repository.findByProblemId(problemId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public List<PublicTestCaseResponse> getPublicByProblem(Long problemId) {

        return repository.findByProblemIdAndType(problemId, TestCaseType.SAMPLE)
                .stream()
                .map(mapper::toPublicResponse)
                .toList();
    }
}