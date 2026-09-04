package com.corvuscode.problem.startercode.service.impl;

import com.corvuscode.problem.entity.Problem;
import com.corvuscode.exception.ProblemNotFoundException;
import com.corvuscode.problem.repository.ProblemRepository;
import com.corvuscode.problem.startercode.dto.StarterCodeRequest;
import com.corvuscode.problem.startercode.dto.StarterCodeResponse;
import com.corvuscode.problem.startercode.entity.StarterCode;
import com.corvuscode.problem.startercode.exception.StarterCodeAlreadyExistsException;
import com.corvuscode.problem.startercode.exception.StarterCodeNotFoundException;
import com.corvuscode.problem.startercode.mapper.StarterCodeMapper;
import com.corvuscode.problem.startercode.repository.StarterCodeRepository;
import com.corvuscode.problem.startercode.service.StarterCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StarterCodeServiceImpl implements StarterCodeService {

    private final StarterCodeRepository starterCodeRepository;
    private final ProblemRepository problemRepository;
    private final StarterCodeMapper starterCodeMapper;

    @Override
    public StarterCodeResponse create(StarterCodeRequest request) {

        Problem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() ->
                        new ProblemNotFoundException("Problem not found."));

        if (starterCodeRepository.existsByProblemIdAndLanguage(
                request.getProblemId(),
                request.getLanguage())) {

            throw new StarterCodeAlreadyExistsException(
                    "Starter code already exists for this language.");
        }

        StarterCode starterCode = starterCodeMapper.toEntity(request);
        starterCode.setProblem(problem);

        StarterCode saved = starterCodeRepository.save(starterCode);

        return starterCodeMapper.toResponse(saved);
    }

    @Override
    public List<StarterCodeResponse> getAll() {

        return starterCodeRepository.findAll()
                .stream()
                .map(starterCodeMapper::toResponse)
                .toList();
    }

    @Override
    public StarterCodeResponse getById(Long id) {

        StarterCode starterCode = starterCodeRepository.findById(id)
                .orElseThrow(() ->
                        new StarterCodeNotFoundException("Starter code not found."));

        return starterCodeMapper.toResponse(starterCode);
    }

    @Override
    public List<StarterCodeResponse> getByProblem(Long problemId) {

        return starterCodeRepository.findByProblemId(problemId)
                .stream()
                .map(starterCodeMapper::toResponse)
                .toList();
    }

    @Override
    public StarterCodeResponse update(Long id, StarterCodeRequest request) {

        StarterCode starterCode = starterCodeRepository.findById(id)
                .orElseThrow(() ->
                        new StarterCodeNotFoundException("Starter code not found."));

        Problem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() ->
                        new ProblemNotFoundException("Problem not found."));

        if (!starterCode.getLanguage().equals(request.getLanguage())
                && starterCodeRepository.existsByProblemIdAndLanguage(
                request.getProblemId(),
                request.getLanguage())) {

            throw new StarterCodeAlreadyExistsException(
                    "Starter code already exists for this language.");
        }

        starterCode.setLanguage(request.getLanguage());
        starterCode.setTemplateCode(request.getTemplateCode());
        starterCode.setProblem(problem);

        StarterCode updated = starterCodeRepository.save(starterCode);

        return starterCodeMapper.toResponse(updated);
    }

    @Override
    public void delete(Long id) {

        StarterCode starterCode = starterCodeRepository.findById(id)
                .orElseThrow(() ->
                        new StarterCodeNotFoundException("Starter code not found."));

        starterCodeRepository.delete(starterCode);
    }
}