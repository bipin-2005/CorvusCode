package com.corvuscode.contest.registration.service.impl;

import com.corvuscode.auth.entity.User;
import com.corvuscode.auth.repository.UserRepository;
import com.corvuscode.contest.entity.Contest;
import com.corvuscode.contest.exception.ContestNotFoundException;
import com.corvuscode.contest.repository.ContestRepository;
import com.corvuscode.contest.registration.dto.response.ContestRegistrationResponse;
import com.corvuscode.contest.registration.entity.ContestRegistration;
import com.corvuscode.contest.registration.exception.AlreadyRegisteredException;
import com.corvuscode.contest.registration.exception.RegistrationClosedException;
import com.corvuscode.contest.registration.mapper.ContestRegistrationMapper;
import com.corvuscode.contest.registration.repository.ContestRegistrationRepository;
import com.corvuscode.contest.registration.service.ContestRegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ContestRegistrationServiceImpl
        implements ContestRegistrationService {

    private final ContestRepository contestRepository;
    private final UserRepository userRepository;
    private final ContestRegistrationRepository registrationRepository;
    private final ContestRegistrationMapper registrationMapper;


    @Override
    @Transactional
    public ContestRegistrationResponse registerForContest(
            Long contestId) {

        /*
         * 1. Find contest
         */
        Contest contest =
                contestRepository.findById(contestId)
                        .orElseThrow(() ->
                                new ContestNotFoundException(contestId));


        /*
         * 2. Check whether registration is required
         *
         * If registration is not required, the user doesn't
         * need to register.
         */
        if (!Boolean.TRUE.equals(
                contest.getRegistrationRequired())) {

            throw new IllegalStateException(
                    "Registration is not required for this contest."
            );
        }


        /*
         * 3. Get currently authenticated user
         */
        User user = getAuthenticatedUser();


        /*
         * 4. Check duplicate registration
         */
        if (registrationRepository
                .existsByContestIdAndUserId(
                        contestId,
                        user.getId())) {

            throw new AlreadyRegisteredException(contestId);
        }


        /*
         * 5. Check registration window
         */
        LocalDateTime now =
                LocalDateTime.now();

        if (now.isBefore(contest.getRegistrationStart())
                || now.isAfter(contest.getRegistrationEnd())) {

            throw new RegistrationClosedException(contestId);
        }


        /*
         * 6. Make sure the contest hasn't started
         */
        if (!now.isBefore(contest.getStartTime())) {

            throw new RegistrationClosedException(contestId);
        }


        /*
         * 7. Create registration
         */
        ContestRegistration registration =
                ContestRegistration.builder()
                        .contest(contest)
                        .user(user)
                        .registeredAt(now)
                        .build();


        /*
         * 8. Save registration
         */
        ContestRegistration savedRegistration =
                registrationRepository.save(registration);


        /*
         * 9. Return response
         */
        return registrationMapper.toResponse(
                savedRegistration
        );
    }


    @Override
    @Transactional(readOnly = true)
    public ContestRegistrationResponse getMyRegistration(
            Long contestId) {

        /*
         * Make sure contest exists.
         */
        contestRepository.findById(contestId)
                .orElseThrow(() ->
                        new ContestNotFoundException(contestId));


        User user = getAuthenticatedUser();


        ContestRegistration registration =
                registrationRepository
                        .findByContestIdAndUserId(
                                contestId,
                                user.getId()
                        )
                        .orElseThrow(() ->
                                new IllegalStateException(
                                        "You are not registered for this contest."
                                ));


        return registrationMapper.toResponse(
                registration
        );
    }


    @Override
    @Transactional
    public void cancelRegistration(Long contestId) {

        /*
         * Make sure contest exists.
         */
        Contest contest =
                contestRepository.findById(contestId)
                        .orElseThrow(() ->
                                new ContestNotFoundException(contestId));


        User user = getAuthenticatedUser();


        ContestRegistration registration =
                registrationRepository
                        .findByContestIdAndUserId(
                                contestId,
                                user.getId()
                        )
                        .orElseThrow(() ->
                                new IllegalStateException(
                                        "You are not registered for this contest."
                                ));


        /*
         * Registration cannot be cancelled after
         * the contest has started.
         */
        LocalDateTime now =
                LocalDateTime.now();

        if (!now.isBefore(contest.getStartTime())) {

            throw new IllegalStateException(
                    "Registration cannot be cancelled after the contest has started."
            );
        }


        registrationRepository.delete(registration);
    }


    /*
     * Gets the actual User entity from the authenticated
     * Spring Security principal.
     */
    private User getAuthenticatedUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();


        if (authentication == null
                || !authentication.isAuthenticated()) {

            throw new IllegalStateException(
                    "User is not authenticated."
            );
        }


        String email =
                authentication.getName();


        return userRepository
                .findByEmailWithRoles(email)
                .orElseThrow(() ->
                        new IllegalStateException(
                                "Authenticated user no longer exists."
                        ));
    }
}