package com.corvuscode.problem.startercode.service;

import com.corvuscode.problem.startercode.dto.StarterCodeRequest;
import com.corvuscode.problem.startercode.dto.StarterCodeResponse;

import java.util.List;

public interface StarterCodeService {

    StarterCodeResponse create(StarterCodeRequest request);

    List<StarterCodeResponse> getAll();

    StarterCodeResponse getById(Long id);

    List<StarterCodeResponse> getByProblem(Long problemId);

    StarterCodeResponse update(Long id, StarterCodeRequest request);

    void delete(Long id);

}