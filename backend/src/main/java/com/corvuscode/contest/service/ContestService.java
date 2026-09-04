package com.corvuscode.contest.service;

import com.corvuscode.contest.dto.request.CreateContestRequest;
import com.corvuscode.contest.dto.request.UpdateContestRequest;
import com.corvuscode.contest.dto.response.ContestResponse;
import org.springframework.data.domain.Page;

public interface ContestService {

    ContestResponse createContest(
            CreateContestRequest request,
            String email
    );

    ContestResponse getContest(
            Long contestId,
            Long userId
    );

    ContestResponse updateContest(
            Long contestId,
            UpdateContestRequest request
    );

    Page<ContestResponse> getAllContests(
            int page,
            int size,
            String sortBy,
            String direction
    );

    void deleteContest(Long contestId);

    void publishContest(Long contestId);

    void cancelContest(Long contestId);

    void finalizeContest(Long contestId);

}