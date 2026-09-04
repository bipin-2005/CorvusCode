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
     * Checks for expired contests every minute.
     *
     * When a contest has passed its end time:
     *
     * 1. Mark it ENDED
     * 2. Mark it finalized
     * 3. Generate certificates
     */
    @Scheduled(fixedDelay = 60000)
    @Transactional
    public void finalizeExpiredContests() {

        LocalDateTime now =
                LocalDateTime.now();


        List<Contest> contests =
                contestRepository
                        .findByEndTimeBeforeAndFinalizedFalse(
                                now
                        );


        if (contests.isEmpty()) {
            return;
        }


        for (Contest contest : contests) {

            try {

                if (
                        contest.getStatus()
                                == ContestStatus.CANCELLED
                ) {
                    continue;
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


                /*
                 * Generate certificates for
                 * every participant.
                 */

                certificateService
                        .generateContestCertificates(
                                contest.getId()
                        );


                log.info(
                        "Certificates generated for contest: {}",
                        contest.getId()
                );


            } catch (Exception e) {

                /*
                 * Do not allow one broken contest
                 * to stop processing other contests.
                 */

                log.error(
                        "Failed to finalize contest {}",
                        contest.getId(),
                        e
                );
            }
        }
    }
}