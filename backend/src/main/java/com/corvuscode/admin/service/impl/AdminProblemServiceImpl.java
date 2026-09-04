package com.corvuscode.admin.service.impl;

import com.corvuscode.admin.dto.AdminProblemResponse;
import com.corvuscode.admin.service.AdminProblemService;
import com.corvuscode.problem.entity.Problem;
import com.corvuscode.problem.repository.ProblemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminProblemServiceImpl
        implements AdminProblemService {

    private final ProblemRepository problemRepository;

    @Override
    public Page<AdminProblemResponse> getProblems(
            int page,
            int size
    ) {

        Pageable pageable = PageRequest.of(page, size);

        return problemRepository.findAll(pageable)
                .map(problem ->
                        AdminProblemResponse.builder()
                                .id(problem.getId())
                                .title(problem.getTitle())
                                .slug(problem.getSlug())
                                .difficulty(problem.getDifficulty())
                                .active(problem.getActive())
                                .build()
                );
    }

    @Override
    @Transactional
    public void activateProblem(Long problemId) {

        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() ->
                        new RuntimeException("Problem not found"));

        problem.setActive(true);

        problemRepository.save(problem);
    }

    @Override
    @Transactional
    public void deactivateProblem(Long problemId) {

        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() ->
                        new RuntimeException("Problem not found"));

        problem.setActive(false);

        problemRepository.save(problem);
    }

}