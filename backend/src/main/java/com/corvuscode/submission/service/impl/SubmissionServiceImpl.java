package com.corvuscode.submission.service.impl;

import com.corvuscode.auth.entity.User;

import com.corvuscode.auth.repository.UserRepository;
import com.corvuscode.contest.entity.Contest;
import com.corvuscode.contest.exception.ContestNotFoundException;
import com.corvuscode.contest.participation.repository.ContestParticipationRepository;
import com.corvuscode.contest.problem.repository.ContestProblemRepository;
import com.corvuscode.contest.repository.ContestRepository;
import com.corvuscode.problem.entity.Problem;
import com.corvuscode.problem.repository.ProblemRepository;
import com.corvuscode.submission.dto.SubmissionRequest;
import com.corvuscode.submission.dto.SubmissionResponse;
import com.corvuscode.submission.dto.SubmissionResultResponse;
import com.corvuscode.submission.entity.Submission;
import com.corvuscode.submission.enums.SubmissionStatus;
import com.corvuscode.submission.exception.SubmissionNotFoundException;
import com.corvuscode.submission.mapper.SubmissionMapper;
import com.corvuscode.submission.repository.SubmissionRepository;
import com.corvuscode.submission.service.SubmissionService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.corvuscode.problem.testcase.entity.TestCase;
import com.corvuscode.problem.testcase.enums.TestCaseType;
import com.corvuscode.problem.testcase.repository.TestCaseRepository;
import com.corvuscode.submission.client.JudgeClient;
import com.corvuscode.submission.dto.JudgeRequest;
import com.corvuscode.submission.dto.JudgeResponse;
import com.corvuscode.submission.submissionresult.entity.SubmissionResult;
import com.corvuscode.submission.submissionresult.repository.SubmissionResultRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SubmissionServiceImpl implements SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;
    private final SubmissionMapper submissionMapper;
    private final TestCaseRepository testCaseRepository;
    private final JudgeClient judgeClient;
    private final SubmissionResultRepository submissionResultRepository;
    private final ContestRepository contestRepository;
    private final ContestProblemRepository contestProblemRepository;
    private final ContestParticipationRepository participationRepository;

    public SubmissionServiceImpl(
            SubmissionRepository submissionRepository,
            ProblemRepository problemRepository,
            UserRepository userRepository,
            SubmissionMapper submissionMapper,
            TestCaseRepository testCaseRepository,
            JudgeClient judgeClient,
            ContestRepository contestRepository,
            ContestProblemRepository contestProblemRepository,
            ContestParticipationRepository participationRepository,
            SubmissionResultRepository submissionResultRepository) {

        this.submissionRepository = submissionRepository;
        this.problemRepository = problemRepository;
        this.userRepository = userRepository;
        this.submissionMapper = submissionMapper;
        this.testCaseRepository = testCaseRepository;
        this.judgeClient = judgeClient;
        this.submissionResultRepository = submissionResultRepository;
        this.contestRepository = contestRepository;
        this.contestProblemRepository = contestProblemRepository;
        this.participationRepository = participationRepository;
    }

    @Override
    public SubmissionResponse createSubmission(SubmissionRequest request) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new EntityNotFoundException("User not found."));

        if (request.getContestId() != null) {

            participationRepository
                    .findByContestIdAndUserId(
                            request.getContestId(),
                            user.getId()
                    )
                    .orElseThrow(() ->
                            new IllegalStateException(
                                    "You have not joined this contest."
                            ));
        }

        Problem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() ->
                        new EntityNotFoundException("Problem not found."));

        if (request.getContestId() != null) {

            boolean exists =
                    contestProblemRepository
                            .existsByContestIdAndProblemId(
                                    request.getContestId(),
                                    request.getProblemId()
                            );

            if (!exists) {

                throw new IllegalStateException(
                        "Problem does not belong to contest."
                );
            }
        }

        Submission submission = submissionMapper.toEntity(request);

        submission.setUser(user);
        submission.setProblem(problem);

        if (request.getContestId() != null) {

            Contest contest =
                    contestRepository.findById(
                                    request.getContestId()
                            )
                            .orElseThrow(() ->
                                    new ContestNotFoundException(
                                            request.getContestId()
                                    ));

            submission.setContest(contest);
        }

        submission.setStatus(SubmissionStatus.PENDING);

        submission.setExecutionTime(null);
        submission.setMemory(null);

        submission.setPassedTestCases(0);
        submission.setTotalTestCases(0);

        submission.setCompileOutput(null);
        submission.setStandardOutput(null);
        submission.setStandardError(null);

        Submission savedSubmission =
                submissionRepository.save(submission);

        List<TestCase> testCases =
                testCaseRepository.findByProblemId(problem.getId());

        System.out.println("Test Cases = " + testCases.size());
        int passed = 0;

        JudgeResponse lastResponse = null;
        System.out.println("Hidden test cases found = " + testCases.size());

        for (TestCase testCase : testCases) {

            JudgeRequest judgeRequest =
                    JudgeRequest.builder()
                            .sourceCode(savedSubmission.getSourceCode())
                            .language(savedSubmission.getLanguage())
                            .stdin(testCase.getInput())
                            .build();

            JudgeResponse response =
                    judgeClient.execute(judgeRequest);

            lastResponse = response;

            boolean passedTestCase =
                    response.getStatus().equals("SUCCESS")
                            &&
                            response.getStdout() != null
                            &&
                            response.getStdout().trim()
                                    .equals(testCase.getExpectedOutput().trim());

            SubmissionResult submissionResult =
                    SubmissionResult.builder()
                            .submission(savedSubmission)
                            .testCase(testCase)
                            .status(
                                    passedTestCase
                                            ? SubmissionStatus.ACCEPTED
                                            : mapJudgeStatus(response.getStatus())
                            )
                            .passed(passedTestCase)
                            .expectedOutput(testCase.getExpectedOutput())
                            .actualOutput(response.getStdout())
                            .executionTime(response.getExecutionTime())
                            .memory(response.getMemory())
                            .build();

            submissionResultRepository.save(submissionResult);

            if (!response.getStatus().equals("SUCCESS")) {

                savedSubmission.setStatus(
                        mapJudgeStatus(response.getStatus())
                );

                savedSubmission.setCompileOutput(
                        response.getCompileOutput()
                );

                savedSubmission.setStandardOutput(
                        response.getStdout()
                );

                savedSubmission.setStandardError(
                        response.getStderr()
                );

                savedSubmission.setExecutionTime(
                        response.getExecutionTime()
                );

                savedSubmission.setMemory(
                        response.getMemory()
                );

                savedSubmission =
                        submissionRepository.save(savedSubmission);

                return submissionMapper.toResponse(savedSubmission);
            }

            if (passedTestCase) {
                passed++;
            }
        }

        savedSubmission.setPassedTestCases(passed);
        savedSubmission.setTotalTestCases(testCases.size());

        if (passed == testCases.size()) {

            savedSubmission.setStatus(
                    SubmissionStatus.ACCEPTED
            );

        } else {

            savedSubmission.setStatus(
                    SubmissionStatus.WRONG_ANSWER
            );
        }

        if (lastResponse != null) {

            savedSubmission.setExecutionTime(
                    lastResponse.getExecutionTime()
            );

            savedSubmission.setMemory(
                    lastResponse.getMemory()
            );

            savedSubmission.setCompileOutput(
                    lastResponse.getCompileOutput()
            );

            savedSubmission.setStandardOutput(
                    lastResponse.getStdout()
            );

            savedSubmission.setStandardError(
                    lastResponse.getStderr()
            );
        }

        savedSubmission =
                submissionRepository.save(savedSubmission);

        return submissionMapper.toResponse(savedSubmission);
    }

    @Override
    @Transactional(readOnly = true)
    public SubmissionResponse getSubmissionById(Long id) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new EntityNotFoundException("User not found."));

        Submission submission =
                submissionRepository.findByIdAndUser(id, user)
                        .orElseThrow(() ->
                                new SubmissionNotFoundException(id));

        return submissionMapper.toResponse(submission);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubmissionResponse> getMySubmissions() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new EntityNotFoundException("User not found."));

        return submissionRepository.findByUser(user)
                .stream()
                .map(submissionMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubmissionResponse> getSubmissionsByProblem(Long problemId) {

        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Problem not found."));

        return submissionRepository.findByProblem(problem)
                .stream()
                .map(submissionMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SubmissionResultResponse getSubmissionResult(
            Long submissionId) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new EntityNotFoundException("User not found."));

        Submission submission =
                submissionRepository.findByIdAndUser(
                                submissionId,
                                user
                        )
                        .orElseThrow(() ->
                                new SubmissionNotFoundException(submissionId));

        return SubmissionResultResponse.builder()
                .submissionId(submission.getId())
                .status(submission.getStatus())
                .executionTime(submission.getExecutionTime())
                .memory(submission.getMemory())
                .compileOutput(submission.getCompileOutput())
                .standardOutput(submission.getStandardOutput())
                .standardError(submission.getStandardError())
                .build();
    }


    private SubmissionStatus mapJudgeStatus(String judgeStatus) {

        return switch (judgeStatus) {

            case "SUCCESS" -> SubmissionStatus.ACCEPTED;

            case "COMPILATION_ERROR" ->
                    SubmissionStatus.COMPILATION_ERROR;

            case "RUNTIME_ERROR" ->
                    SubmissionStatus.RUNTIME_ERROR;

            case "TIME_LIMIT_EXCEEDED" ->
                    SubmissionStatus.TIME_LIMIT_EXCEEDED;

            case "MEMORY_LIMIT_EXCEEDED" ->
                    SubmissionStatus.MEMORY_LIMIT_EXCEEDED;

            default -> SubmissionStatus.WRONG_ANSWER;
        };
    }
}