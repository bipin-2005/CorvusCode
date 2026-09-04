package com.corvuscode.contest.participation.service;

import com.corvuscode.contest.participation.dto.response.ContestParticipationResponse;

public interface ContestParticipationService {

    ContestParticipationResponse joinContest(
            Long contestId
    );

    ContestParticipationResponse getMyParticipation(
            Long contestId
    );
}