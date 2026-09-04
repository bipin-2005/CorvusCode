package com.corvuscode.contest.mapper;

import com.corvuscode.contest.dto.request.CreateContestRequest;
import com.corvuscode.contest.dto.request.UpdateContestRequest;
import com.corvuscode.contest.dto.response.ContestResponse;
import com.corvuscode.contest.entity.Contest;
import org.springframework.stereotype.Component;

@Component
public class ContestMapper {

    public Contest toEntity(CreateContestRequest request) {

        return Contest.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .registrationStart(request.getRegistrationStart())
                .registrationEnd(request.getRegistrationEnd())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .durationMinutes(request.getDurationMinutes())
                .visibility(request.getVisibility())
                .registrationRequired(request.getRegistrationRequired())
                .ranked(request.getRanked())
                .build();
    }

    public ContestResponse toResponse(Contest contest) {

        return ContestResponse.builder()
                .id(contest.getId())
                .title(contest.getTitle())
                .description(contest.getDescription())
                .registrationStart(contest.getRegistrationStart())
                .registrationEnd(contest.getRegistrationEnd())
                .startTime(contest.getStartTime())
                .endTime(contest.getEndTime())
                .durationMinutes(contest.getDurationMinutes())
                .status(contest.getStatus())
                .visibility(contest.getVisibility())
                .registrationRequired(contest.getRegistrationRequired())
                .ranked(contest.getRanked())
                .createdBy(contest.getCreatedBy().getId())
                .build();
    }

    public void updateEntity(
            UpdateContestRequest request,
            Contest contest) {

        if (request.getTitle() != null)
            contest.setTitle(request.getTitle());

        if (request.getDescription() != null)
            contest.setDescription(request.getDescription());

        if (request.getRegistrationStart() != null)
            contest.setRegistrationStart(request.getRegistrationStart());

        if (request.getRegistrationEnd() != null)
            contest.setRegistrationEnd(request.getRegistrationEnd());

        if (request.getStartTime() != null)
            contest.setStartTime(request.getStartTime());

        if (request.getEndTime() != null)
            contest.setEndTime(request.getEndTime());

        if (request.getDurationMinutes() != null)
            contest.setDurationMinutes(request.getDurationMinutes());

        if (request.getVisibility() != null)
            contest.setVisibility(request.getVisibility());

        if (request.getRegistrationRequired() != null)
            contest.setRegistrationRequired(request.getRegistrationRequired());

        if (request.getRanked() != null)
            contest.setRanked(request.getRanked());
    }
}