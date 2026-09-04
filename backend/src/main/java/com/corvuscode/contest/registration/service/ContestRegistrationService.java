package com.corvuscode.contest.registration.service;

import com.corvuscode.contest.registration.dto.response.ContestRegistrationResponse;

public interface ContestRegistrationService {

    ContestRegistrationResponse registerForContest(Long contestId);

    ContestRegistrationResponse getMyRegistration(Long contestId);

    void cancelRegistration(Long contestId);
}