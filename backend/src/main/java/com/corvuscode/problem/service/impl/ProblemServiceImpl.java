package com.corvuscode.problem.service.impl;

import com.corvuscode.problem.dto.ProblemRequest;
import com.corvuscode.problem.dto.ProblemResponse;
import com.corvuscode.problem.entity.Problem;
import com.corvuscode.problem.mapper.ProblemMapper;
import com.corvuscode.problem.repository.ProblemRepository;
import com.corvuscode.problem.service.ProblemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.corvuscode.exception.ProblemNotFoundException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProblemServiceImpl implements ProblemService {

    private final ProblemRepository problemRepository;

    @Override
    public ProblemResponse createProblem(ProblemRequest request) {

        Problem problem = ProblemMapper.toEntity(request);

        problem.setSlug(generateSlug(request.getTitle()));

        Problem savedProblem = problemRepository.save(problem);

        return ProblemMapper.toResponse(savedProblem);
    }

    @Override
    public List<ProblemResponse> getAllProblems() {

        return problemRepository.findByActiveTrue()
                .stream()
                .map(ProblemMapper::toResponse)
                .toList();
    }

    @Override
    public ProblemResponse getProblemBySlug(String slug) {

        Problem problem = problemRepository.findBySlugAndActiveTrue(slug)
                                        .orElseThrow(ProblemNotFoundException::new);

        return ProblemMapper.toResponse(problem);
    }

    @Override
    public ProblemResponse getProblemById(Long id) {

        Problem problem = problemRepository.findById(id)
                .orElseThrow(ProblemNotFoundException::new);

        return ProblemMapper.toResponse(problem);
    }

    @Override
    public ProblemResponse updateProblem(Long id,
                                         ProblemRequest request) {

        Problem problem = problemRepository.findById(id)
                .orElseThrow(ProblemNotFoundException::new);

        String oldTitle = problem.getTitle();

        problem.setTitle(request.getTitle());
        problem.setDifficulty(request.getDifficulty());
        problem.setDescription(request.getDescription());
        problem.setConstraints(request.getConstraints());
        problem.setInputFormat(request.getInputFormat());
        problem.setOutputFormat(request.getOutputFormat());
        problem.setExplanation(request.getExplanation());
        problem.setTimeLimit(request.getTimeLimit());
        problem.setMemoryLimit(request.getMemoryLimit());

        if (!oldTitle.equals(request.getTitle())) {
            problem.setSlug(generateSlug(request.getTitle()));
        }

        return ProblemMapper.toResponse(problemRepository.save(problem));
    }

    @Override
    public void deleteProblem(Long id) {

        if (!problemRepository.existsById(id)) {
            throw new ProblemNotFoundException();
        }

        problemRepository.deleteById(id);
    }

    private String generateSlug(String title) {

        String slug = title
                .toLowerCase()
                .trim()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-");

        String originalSlug = slug;

        int count = 1;

        while (problemRepository.existsBySlug(slug)) {

            slug = originalSlug + "-" + count;

            count++;
        }

        return slug;
    }
    @Override
    public void activate(Long id) {

        Problem problem = problemRepository.findById(id)
                .orElseThrow(ProblemNotFoundException::new);

        problem.setActive(true);

        problemRepository.save(problem);
    }

    @Override
    public void deactivate(Long id) {

        Problem problem = problemRepository.findById(id)
                .orElseThrow(ProblemNotFoundException::new);

        problem.setActive(false);

        problemRepository.save(problem);
    }
}