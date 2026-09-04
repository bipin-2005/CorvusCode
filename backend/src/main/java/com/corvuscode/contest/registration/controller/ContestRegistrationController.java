package com.corvuscode.contest.registration.controller;

import com.corvuscode.contest.registration.dto.response.ContestRegistrationResponse;
import com.corvuscode.contest.registration.service.ContestRegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contests/{contestId}/registration")
@RequiredArgsConstructor
public class ContestRegistrationController {

    private final ContestRegistrationService registrationService;


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContestRegistrationResponse registerForContest(
            @PathVariable Long contestId) {

        return registrationService.registerForContest(contestId);
    }


    @GetMapping
    public ContestRegistrationResponse getMyRegistration(
            @PathVariable Long contestId) {

        return registrationService.getMyRegistration(contestId);
    }


    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancelRegistration(
            @PathVariable Long contestId) {

        registrationService.cancelRegistration(contestId);
    }
}