package com.corvuscode.contest.participation.service.impl;

import com.corvuscode.auth.entity.User;
import com.corvuscode.auth.repository.UserRepository;
import com.corvuscode.contest.entity.Contest;
import com.corvuscode.contest.enums.ContestStatus;
import com.corvuscode.contest.exception.ContestNotFoundException;
import com.corvuscode.contest.participation.dto.response.ContestParticipationResponse;
import com.corvuscode.contest.participation.entity.ContestParticipation;
import com.corvuscode.contest.participation.repository.ContestParticipationRepository;
import com.corvuscode.contest.participation.service.ContestParticipationService;
import com.corvuscode.contest.registration.repository.ContestRegistrationRepository;
import com.corvuscode.contest.repository.ContestRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ContestParticipationServiceImpl
        implements ContestParticipationService {

    private final ContestRepository contestRepository;

    private final ContestParticipationRepository
            participationRepository;

    private final ContestRegistrationRepository
            contestRegistrationRepository;

    private final UserRepository userRepository;


    /*
     * =========================================================
     * JOIN / ENTER CONTEST
     * =========================================================
     *
     * This method creates the record in:
     *
     * contest_participations
     *
     * It should be called when the user clicks:
     *
     * "Enter Contest"
     */
    @Override
    @Transactional
    public ContestParticipationResponse joinContest(
            Long contestId
    ) {

        /*
         * -----------------------------------------------------
         * 1. Find contest
         * -----------------------------------------------------
         */

        Contest contest =
                contestRepository
                        .findById(contestId)
                        .orElseThrow(() ->
                                new ContestNotFoundException(
                                        contestId
                                )
                        );


        /*
         * -----------------------------------------------------
         * 2. Get authenticated user
         * -----------------------------------------------------
         */

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();


        if (
                authentication == null ||
                        !authentication.isAuthenticated()
        ) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "You must be logged in."
            );
        }


        String email =
                authentication.getName();


        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new EntityNotFoundException(
                                        "User not found."
                                )
                        );


        /*
         * -----------------------------------------------------
         * 3. Check registration
         * -----------------------------------------------------
         *
         * Registration and participation are different.
         *
         * Registration:
         * contest_registrations
         *
         * Participation:
         * contest_participations
         */

        boolean registered =
                contestRegistrationRepository
                        .existsByContestIdAndUserId(
                                contestId,
                                user.getId()
                        );


        if (!registered) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Please register for the contest first."
            );
        }


        /*
         * -----------------------------------------------------
         * 4. Check contest status/time
         * -----------------------------------------------------
         */

        if (
                contest.getStatus()
                        == ContestStatus.CANCELLED
        ) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This contest has been cancelled."
            );
        }


        LocalDateTime now =
                LocalDateTime.now();


        /*
         * Contest hasn't started.
         */

        if (
                now.isBefore(
                        contest.getStartTime()
                )
        ) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Contest has not started yet."
            );
        }


        /*
         * Contest has ended.
         *
         * Using !isBefore() also handles the exact
         * end-time boundary correctly.
         */

        if (
                !now.isBefore(
                        contest.getEndTime()
                )
        ) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Contest has already ended."
            );
        }


        /*
         * -----------------------------------------------------
         * 5. Check existing participation
         * -----------------------------------------------------
         */

        ContestParticipation existingParticipation =
                participationRepository
                        .findByContestIdAndUserId(
                                contestId,
                                user.getId()
                        )
                        .orElse(null);


        /*
         * If the user has already entered the contest,
         * simply return the existing participation.
         *
         * This makes Enter Contest idempotent.
         */

        if (existingParticipation != null) {

            return ContestParticipationResponse
                    .builder()
                    .id(
                            existingParticipation.getId()
                    )
                    .contestId(
                            contest.getId()
                    )
                    .userId(
                            user.getId()
                    )
                    .joinedAt(
                            existingParticipation.getJoinedAt()
                    )
                    .build();
        }


        /*
         * -----------------------------------------------------
         * 6. Create participation
         * -----------------------------------------------------
         */

        ContestParticipation participation =
                ContestParticipation
                        .builder()
                        .contest(contest)
                        .user(user)
                        .joinedAt(now)
                        .build();


        /*
         * -----------------------------------------------------
         * 7. Save participation
         * -----------------------------------------------------
         */

        ContestParticipation saved =
                participationRepository.save(
                        participation
                );


        /*
         * -----------------------------------------------------
         * 8. Return response
         * -----------------------------------------------------
         */

        return ContestParticipationResponse
                .builder()
                .id(
                        saved.getId()
                )
                .contestId(
                        contest.getId()
                )
                .userId(
                        user.getId()
                )
                .joinedAt(
                        saved.getJoinedAt()
                )
                .build();
    }


    /*
     * =========================================================
     * GET MY PARTICIPATION
     * =========================================================
     */

    @Override
    @Transactional(readOnly = true)
    public ContestParticipationResponse
    getMyParticipation(
            Long contestId
    ) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();


        if (
                authentication == null ||
                        !authentication.isAuthenticated()
        ) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "You must be logged in."
            );
        }


        String email =
                authentication.getName();


        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new EntityNotFoundException(
                                        "User not found."
                                )
                        );


        ContestParticipation participation =
                participationRepository
                        .findByContestIdAndUserId(
                                contestId,
                                user.getId()
                        )
                        .orElseThrow(() ->
                                new EntityNotFoundException(
                                        "Participation not found."
                                )
                        );


        return ContestParticipationResponse
                .builder()
                .id(
                        participation.getId()
                )
                .contestId(
                        participation
                                .getContest()
                                .getId()
                )
                .userId(
                        participation
                                .getUser()
                                .getId()
                )
                .joinedAt(
                        participation.getJoinedAt()
                )
                .build();
    }
}