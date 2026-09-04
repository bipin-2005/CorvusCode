package com.corvuscode.contest.registration.mapper;

import com.corvuscode.contest.registration.dto.response.ContestRegistrationResponse;
import com.corvuscode.contest.registration.entity.ContestRegistration;
import org.springframework.stereotype.Component;

@Component
public class ContestRegistrationMapper {

    public ContestRegistrationResponse toResponse(
            ContestRegistration registration) {

        return ContestRegistrationResponse.builder()
                .registrationId(registration.getId())
                .contestId(registration.getContest().getId())
                .userId(registration.getUser().getId())
                .registeredAt(registration.getRegisteredAt())
                .build();
    }
}