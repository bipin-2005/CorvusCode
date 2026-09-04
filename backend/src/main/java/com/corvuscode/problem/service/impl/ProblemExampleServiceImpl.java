package com.corvuscode.problem.service.impl;

import com.corvuscode.exception.ProblemExampleNotFoundException;
import com.corvuscode.exception.ProblemNotFoundException;
import com.corvuscode.problem.dto.ProblemExampleRequest;
import com.corvuscode.problem.dto.ProblemExampleResponse;
import com.corvuscode.problem.entity.Problem;
import com.corvuscode.problem.entity.ProblemExample;
import com.corvuscode.problem.mapper.ProblemExampleMapper;
import com.corvuscode.problem.repository.ProblemExampleRepository;
import com.corvuscode.problem.repository.ProblemRepository;
import com.corvuscode.problem.service.ProblemExampleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProblemExampleServiceImpl implements ProblemExampleService {

    private final ProblemRepository problemRepository;
    private final ProblemExampleRepository exampleRepository;

    @Override
    public ProblemExampleResponse create(Long problemId,
                                         ProblemExampleRequest request) {

        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new RuntimeException("Problem not found."));

        ProblemExample example =
                ProblemExampleMapper.toEntity(request, problem);

        return ProblemExampleMapper.toResponse(
                exampleRepository.save(example)
        );
    }

    @Override
    public List<ProblemExampleResponse> getAll(Long problemId) {

        return exampleRepository.findByProblemId(problemId)
                .stream()
                .map(ProblemExampleMapper::toResponse)
                .toList();
    }

    @Override
    public ProblemExampleResponse update(Long exampleId,
                                         ProblemExampleRequest request) {

        ProblemExample example = exampleRepository.findById(exampleId)
                .orElseThrow(() -> new ProblemExampleNotFoundException("Example not found."));

        example.setInput(request.getInput());
        example.setOutput(request.getOutput());
        example.setExplanation(request.getExplanation());

        return ProblemExampleMapper.toResponse(
                exampleRepository.save(example)
        );
    }

    @Override
    public void delete(Long exampleId) {

        ProblemExample example = exampleRepository.findById(exampleId)
                .orElseThrow(() -> new ProblemNotFoundException("Problem not found."));

        exampleRepository.delete(example);
    }
}