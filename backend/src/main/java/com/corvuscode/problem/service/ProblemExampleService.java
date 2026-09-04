package com.corvuscode.problem.service;

import com.corvuscode.problem.dto.ProblemExampleRequest;
import com.corvuscode.problem.dto.ProblemExampleResponse;

import java.util.List;

public interface ProblemExampleService {

    ProblemExampleResponse create(Long problemId,
                                  ProblemExampleRequest request);

    List<ProblemExampleResponse> getAll(Long problemId);

    ProblemExampleResponse update(Long exampleId,
                                  ProblemExampleRequest request);

    void delete(Long exampleId);
}