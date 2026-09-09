package com.corvuscode.contest.scheduler;

import com.corvuscode.certificate.service.CertificateService;
import com.corvuscode.contest.entity.Contest;
import com.corvuscode.contest.enums.ContestStatus;
import com.corvuscode.contest.repository.ContestRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ContestFinalizationScheduler {

    private final ContestRepository contestRepository;

    private final CertificateService certificateService;


    /**
     * Automatically checks for expired contests.
     *
     * Runs every minute.
     *
     * When a contest reaches its end time:
     *
     * 1. Mark contest as ENDED
     * 2. Mark contest as finalized
     * 3. Generate certificates
     */
    @Scheduled(fixedDelay = 60000)
    public void finalizeExpiredContests() {

        LocalDateTime now =
                LocalDateTime.now();

        log.debug(
                "Checking for expired contests at {}",
                now
        );


        List<Contest> contests =
                contestRepository
                        .findByEndTimeBeforeAndFinalizedFalse(
                                now
                        );


        if (contests.isEmpty()) {

            log.debug(
                    "No expired contests found."
            );

            return;
        }


        log.info(
                "Found {} expired contest(s) to finalize.",
                contests.size()
        );


        for (Contest contest : contests) {

            try {

                finalizeContest(
                        contest
                );

            } catch (Exception e) {

                /*
                 * A failure in one contest must not
                 * stop other contests from being processed.
                 */

                log.error(
                        "Failed to finalize contest {} - {}",
                        contest.getId(),
                        contest.getTitle(),
                        e
                );
            }
        }
    }


    /**
     * Finalizes one contest in its own transaction.
     */
    @Transactional
    public void finalizeContest(
            Contest contest
    ) {

        /*
         * Double-check cancellation.
         */

        if (
                contest.getStatus()
                        == ContestStatus.CANCELLED
        ) {

            log.info(
                    "Skipping cancelled contest: {}",
                    contest.getId()
            );

            return;
        }


        /*
         * Double-check finalization.
         */

        if (
                Boolean.TRUE.equals(
                        contest.getFinalized()
                )
        ) {

            log.info(
                    "Contest {} is already finalized.",
                    contest.getId()
            );

            return;
        }


        LocalDateTime now =
                LocalDateTime.now();


        /*
         * Safety check.
         *
         * Never finalize a contest before its
         * actual end time.
         */

        if (
                contest.getEndTime() == null
                        ||
                        now.isBefore(
                                contest.getEndTime()
                        )
        ) {

            log.debug(
                    "Contest {} has not ended yet.",
                    contest.getId()
            );

            return;
        }


        log.info(
                "Finalizing expired contest: {} - {}",
                contest.getId(),
                contest.getTitle()
        );


        /*
         * Mark contest as ended.
         */

        contest.setStatus(
                ContestStatus.ENDED
        );


        /*
         * Prevent duplicate processing.
         */

        contest.setFinalized(
                true
        );


        contestRepository.save(
                contest
        );


        log.info(
                "Contest {} marked as ENDED and finalized.",
                contest.getId()
        );


        /*
         * Generate certificates for every
         * contest participant.
         */

        certificateService
                .generateContestCertificates(
                        contest.getId()
                );


        log.info(
                "Contest {} finalized successfully. "
                        + "Certificates generated.",
                contest.getId()
        );
    }
}