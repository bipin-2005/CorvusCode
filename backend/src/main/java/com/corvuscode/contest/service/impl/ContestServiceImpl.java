package com.corvuscode.contest.service.impl;

import com.corvuscode.auth.repository.UserRepository;
import com.corvuscode.certificate.service.CertificateService;
import com.corvuscode.contest.dto.request.CreateContestRequest;
import com.corvuscode.contest.dto.request.UpdateContestRequest;
import com.corvuscode.contest.dto.response.ContestResponse;
import com.corvuscode.contest.exception.ContestNotFoundException;
import com.corvuscode.contest.mapper.ContestMapper;
import com.corvuscode.contest.participation.repository.ContestParticipationRepository;
import com.corvuscode.contest.problem.repository.ContestProblemRepository;
import com.corvuscode.contest.registration.repository.ContestRegistrationRepository;
import com.corvuscode.contest.repository.ContestRepository;
import com.corvuscode.contest.service.ContestService;
import com.corvuscode.submission.entity.Submission;
import com.corvuscode.submission.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import com.corvuscode.auth.entity.User;
import com.corvuscode.contest.entity.Contest;
import com.corvuscode.contest.enums.ContestStatus;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import com.corvuscode.submission.repository.SubmissionRepository;
import com.corvuscode.submission.submissionresult.repository.SubmissionResultRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContestServiceImpl implements ContestService {
    private final ContestParticipationRepository
            contestParticipationRepository;

    // Repository dependencies
    private final ContestRepository contestRepository;

    private final ContestMapper contestMapper;
    private final CertificateService certificateService;
    private final UserRepository userRepository;
    private final ContestRegistrationRepository contestRegistrationRepository;
    private final ContestProblemRepository
            contestProblemRepository;
    private final SubmissionRepository submissionRepository;


    private final SubmissionResultRepository
            submissionResultRepository;


    /**
     * Creates a new contest after validating input,
     * assigning the creator, setting status, and saving it.
     */
    @Override
    @Transactional
    public ContestResponse createContest(
            CreateContestRequest request,
            String email
    ) {

        User admin = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        validateContestDates(request);

        Contest contest =
                contestMapper.toEntity(request);

        contest.setCreatedBy(admin);

        contest.setStatus(
                ContestStatus.DRAFT
        );

        Contest savedContest =
                contestRepository.save(contest);

        return contestMapper.toResponse(
                savedContest
        );
    }



    /**
     * Validates contest dates and duration
     * for contest creation.
     */
    private void validateContestDates(
            CreateContestRequest request) {

        if (request.getRegistrationStart()
                .isAfter(request.getRegistrationEnd())) {

            throw new IllegalArgumentException(
                    "Registration start must be before registration end."
            );
        }

        if (request.getRegistrationEnd()
                .isAfter(request.getStartTime())) {

            throw new IllegalArgumentException(
                    "Registration must end before contest starts."
            );
        }

        if (request.getStartTime()
                .isAfter(request.getEndTime())) {

            throw new IllegalArgumentException(
                    "Start time must be before end time."
            );
        }

        if (request.getDurationMinutes() <= 0) {

            throw new IllegalArgumentException(
                    "Duration must be greater than zero."
            );
        }
    }


    /**
     * Determines the current contest status
     * based on start and end time.
     */
    private ContestStatus determineStatus(
            Contest contest) {

        if (contest.getStatus()
                == ContestStatus.CANCELLED) {

            return ContestStatus.CANCELLED;
        }

        if (Boolean.TRUE.equals(
                contest.getFinalized()
        )) {

            return ContestStatus.ENDED;
        }

        LocalDateTime now =
                LocalDateTime.now();

        if (now.isBefore(
                contest.getStartTime()
        )) {

            return ContestStatus.UPCOMING;
        }

        if (now.isAfter(
                contest.getEndTime()
        )) {

            return ContestStatus.ENDED;
        }

        return ContestStatus.RUNNING;
    }


    /**
     * Retrieves a contest by its ID.
     */
    @Override
    @Transactional(readOnly = true)
    public ContestResponse getContest(
            Long contestId,
            Long userId
    ) {

        Contest contest =
                contestRepository.findById(contestId)
                        .orElseThrow(() ->
                                new ContestNotFoundException(
                                        contestId
                                )
                        );

        /*
         * Calculate the real status from the
         * contest dates.
         */
        ContestStatus currentStatus =
                determineStatus(contest);

        contest.setStatus(currentStatus);

        /*
         * Map contest to response.
         */
        ContestResponse response =
                contestMapper.toResponse(contest);

        /*
         * Check registration.
         */
        boolean registered =
                contestRegistrationRepository
                        .existsByContestIdAndUserId(
                                contestId,
                                userId
                        );

        /*
         * Count ACTUAL participants.
         *
         * This counts rows in:
         * contest_participations
         */
        long participantCount =
                contestParticipationRepository
                        .countByContestId(contestId);

        /*
         * Check whether current user is
         * participating.
         */
        boolean participating =
                contestParticipationRepository
                        .existsByContestIdAndUserId(
                                contestId,
                                userId
                        );

        response.setRegistered(registered);

        response.setParticipantCount(
                participantCount
        );

        /*
         * If ContestResponse has this field,
         * expose it to the frontend.
         */
        response.setParticipating(
                participating
        );

        return response;
    }
    /**
     * Returns all contests with pagination
     * and sorting support.
     */
    @Override
    public Page<ContestResponse> getAllContests(
            int page,
            int size,
            String sortBy,
            String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable =
                PageRequest.of(page, size, sort);

        return contestRepository
                .findAll(pageable)
                .map(contest -> {

                    ContestResponse response =
                            contestMapper.toResponse(contest);

                    response.setStatus(
                            determineStatus(contest)
                    );


                    return response;
                });
    }



    /**
     * Validates contest dates and duration
     * for an existing Contest entity.
     */
    private void validateContestDates(
            Contest contest) {

        if (!contest.getRegistrationStart()
                .isBefore(contest.getRegistrationEnd())) {

            throw new IllegalArgumentException(
                    "Registration start must be before registration end."
            );
        }

        if (contest.getRegistrationEnd()
                .isAfter(contest.getStartTime())) {

            throw new IllegalArgumentException(
                    "Registration must end before contest starts."
            );
        }

        if (!contest.getStartTime()
                .isBefore(contest.getEndTime())) {

            throw new IllegalArgumentException(
                    "Start time must be before end time."
            );
        }

        if (contest.getDurationMinutes() <= 0) {

            throw new IllegalArgumentException(
                    "Duration must be greater than zero."
            );
        }
    }


    /**
     * Updates an existing contest after
     * validation and status recalculation.
     */
    @Override
    @Transactional
    public ContestResponse updateContest(
            Long contestId,
            UpdateContestRequest request) {

        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() ->
                        new ContestNotFoundException(contestId));

        contestMapper.updateEntity(request, contest);

        validateContestDates(contest);

        contest.setStatus(
                determineStatus(contest)
        );


        Contest updatedContest =
                contestRepository.save(contest);

        return contestMapper.toResponse(updatedContest);
    }


    /**
     * Deletes a contest by its ID.
     */
    @Override
    @Transactional
    public void deleteContest(Long contestId) {

        Contest contest =
                contestRepository.findById(contestId)
                        .orElseThrow(() ->
                                new ContestNotFoundException(contestId));

        // 1. Registrations
        contestRegistrationRepository
                .deleteByContestId(contestId);

        // 2. Participations
        contestParticipationRepository
                .deleteByContestId(contestId);

        // 3. Contest problems
        contestProblemRepository
                .deleteByContestId(contestId);

        // 4. Find submissions belonging to contest
        List<Submission> submissions =
                submissionRepository
                        .findByContestId(contestId);

        // 5. Delete submission results first
        for (Submission submission : submissions) {
            submissionResultRepository
                    .deleteBySubmission(submission);
        }

        // 6. Delete submissions
        submissionRepository
                .deleteAll(submissions);

        // 7. Finally delete contest
        contestRepository.delete(contest);
    }

    @Override
    @Transactional
    public void publishContest(Long contestId) {

        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() ->
                        new RuntimeException("Contest not found"));

        contest.setStatus(ContestStatus.UPCOMING);

        contestRepository.save(contest);
    }

    @Override
    @Transactional
    public void cancelContest(Long contestId) {

        Contest contest = contestRepository.findById(contestId)
                .orElseThrow(() ->
                        new RuntimeException("Contest not found"));

        contest.setStatus(ContestStatus.CANCELLED);

        contestRepository.save(contest);
    }

    @Override
    @Transactional
    public void finalizeContest(Long contestId) {

        Contest contest =
                contestRepository.findById(contestId)
                        .orElseThrow(() ->
                                new ContestNotFoundException(
                                        contestId
                                ));


        /*
         * Cancelled contests cannot be finalized.
         */
        if (contest.getStatus()
                == ContestStatus.CANCELLED) {

            throw new IllegalStateException(
                    "Cancelled contest cannot be finalized"
            );
        }


        /*
         * Prevent duplicate finalization.
         */
        if (Boolean.TRUE.equals(
                contest.getFinalized()
        )) {

            throw new IllegalStateException(
                    "Contest is already finalized"
            );
        }


        /*
         * Contest must have ended.
         */
        LocalDateTime now =
                LocalDateTime.now();

        if (now.isBefore(
                contest.getEndTime()
        )) {

            throw new IllegalStateException(
                    "Contest has not ended yet"
            );
        }


        /*
         * Lock the contest.
         */
        contest.setStatus(
                ContestStatus.ENDED
        );

        contest.setFinalized(true);

        contestRepository.save(contest);


        /*
         * Generate certificates.
         */
        certificateService
                .generateContestCertificates(
                        contestId
                );
    }

}