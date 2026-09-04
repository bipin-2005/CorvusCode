package com.corvuscode.contest.problem.service.impl;

import com.corvuscode.contest.entity.Contest;
import com.corvuscode.contest.exception.ContestNotFoundException;
import com.corvuscode.contest.problem.service.ContestProblemService;
import com.corvuscode.contest.repository.ContestRepository;
import com.corvuscode.contest.problem.dto.request.AddContestProblemRequest;
import com.corvuscode.contest.problem.dto.response.ContestProblemResponse;
import com.corvuscode.contest.problem.entity.ContestProblem;
import com.corvuscode.contest.problem.mapper.ContestProblemMapper;
import com.corvuscode.contest.problem.repository.ContestProblemRepository;
import com.corvuscode.problem.entity.Problem;
import com.corvuscode.exception.ProblemNotFoundException;
import com.corvuscode.problem.repository.ProblemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.corvuscode.contest.problem.dto.request.UpdateContestProblemRequest;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContestProblemServiceImpl
        implements ContestProblemService {

    private final ContestRepository contestRepository;
    private final ProblemRepository problemRepository;
    private final ContestProblemRepository contestProblemRepository;
    private final ContestProblemMapper contestProblemMapper;


    @Override
    @Transactional
    public ContestProblemResponse addProblemToContest(
            Long contestId,
            AddContestProblemRequest request) {

        /*
         * 1. Find contest
         */
        Contest contest =
                contestRepository.findById(contestId)
                        .orElseThrow(() ->
                                new ContestNotFoundException(contestId));


        /*
         * 2. Find problem
         */
        Problem problem =
                problemRepository.findById(request.getProblemId())
                        .orElseThrow(() ->
                                new ProblemNotFoundException(
                                        request.getProblemId()
                                ));


        /*
         * 3. Prevent duplicate problem
         */
        if (contestProblemRepository
                .existsByContestIdAndProblemId(
                        contestId,
                        request.getProblemId())) {

            throw new IllegalStateException(
                    "Problem is already added to this contest."
            );
        }


        /*
         * 4. Create ContestProblem
         */
        ContestProblem contestProblem =
                ContestProblem.builder()
                        .contest(contest)
                        .problem(problem)
                        .points(request.getPoints())
                        .displayOrder(request.getDisplayOrder())
                        .build();


        /*
         * 5. Save
         */
        ContestProblem saved =
                contestProblemRepository.save(contestProblem);


        /*
         * 6. Return response
         */
        return contestProblemMapper.toResponse(saved);
    }


    @Override
    @Transactional(readOnly = true)
    public List<ContestProblemResponse> getContestProblems(
            Long contestId) {

        /*
         * Make sure contest exists.
         */
        contestRepository.findById(contestId)
                .orElseThrow(() ->
                        new ContestNotFoundException(contestId));


        return contestProblemRepository
                .findByContestIdOrderByDisplayOrderAsc(contestId)
                .stream()
                .map(contestProblemMapper::toResponse)
                .toList();
    }


    @Override
    @Transactional
    public void removeProblemFromContest(
            Long contestId,
            Long problemId) {

        /*
         * Make sure contest exists.
         */
        contestRepository.findById(contestId)
                .orElseThrow(() ->
                        new ContestNotFoundException(contestId));


        /*
         * Make sure relationship exists.
         */
        ContestProblem contestProblem =
                contestProblemRepository
                        .findByContestIdAndProblemId(
                                contestId,
                                problemId
                        )
                        .orElseThrow(() ->
                                new IllegalStateException(
                                        "Problem is not part of this contest."
                                ));


        contestProblemRepository.delete(contestProblem);
    }

    @Override
    @Transactional
    public ContestProblemResponse updateContestProblem(
            Long contestId,
            Long problemId,
            UpdateContestProblemRequest request) {

        ContestProblem contestProblem =
                contestProblemRepository
                        .findByContestIdAndProblemId(
                                contestId,
                                problemId
                        )
                        .orElseThrow(() ->
                                new IllegalStateException(
                                        "Problem is not part of this contest."
                                ));

        contestProblem.setPoints(request.getPoints());

        contestProblem.setDisplayOrder(
                request.getDisplayOrder()
        );

        ContestProblem updated =
                contestProblemRepository.save(contestProblem);

        return contestProblemMapper.toResponse(updated);
    }
}
