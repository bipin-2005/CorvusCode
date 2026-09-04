package com.corvuscode.admin.service;

import com.corvuscode.admin.dto.AdminProblemResponse;
import org.springframework.data.domain.Page;

public interface AdminProblemService {

    Page<AdminProblemResponse> getProblems(
            int page,
            int size
    );

    void activateProblem(Long problemId);

    void deactivateProblem(Long problemId);

}