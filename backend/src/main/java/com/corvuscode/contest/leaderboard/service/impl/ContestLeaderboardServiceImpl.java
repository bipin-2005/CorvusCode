package com.corvuscode.contest.leaderboard.service.impl;

import com.corvuscode.contest.leaderboard.dto.response.ContestLeaderboardResponse;
import com.corvuscode.contest.leaderboard.repository.ContestLeaderboardRepository;
import com.corvuscode.contest.leaderboard.service.ContestLeaderboardService;
import com.corvuscode.contest.participation.entity.ContestParticipation;
import com.corvuscode.contest.participation.repository.ContestParticipationRepository;
import com.corvuscode.problem.entity.Difficulty;
import com.corvuscode.submission.entity.Submission;
import com.corvuscode.submission.enums.SubmissionStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ContestLeaderboardServiceImpl
        implements ContestLeaderboardService {

    private final ContestLeaderboardRepository repository;

    private final ContestParticipationRepository
            participationRepository;


    private int getPoints(Difficulty difficulty) {

        return switch (difficulty) {
            case EASY -> 100;
            case MEDIUM -> 200;
            case HARD -> 300;
        };
    }


    @Override
    public List<ContestLeaderboardResponse> getLeaderboard(
            Long contestId) {

        /*
         * Get everyone who participated.
         */
        List<ContestParticipation> participants =
                participationRepository
                        .findByContestId(contestId);


        /*
         * LinkedHashMap keeps insertion order.
         */
        Map<Long, ContestLeaderboardResponse> leaderboard =
                new LinkedHashMap<>();


        /*
         * Initialize every participant.
         */
        for (ContestParticipation participation :
                participants) {

            Long userId =
                    participation.getUser().getId();

            leaderboard.put(
                    userId,
                    ContestLeaderboardResponse.builder()
                            .userId(userId)
                            .fullName(
                                    participation
                                            .getUser()
                                            .getFullName()
                            )
                            .score(0)
                            .solvedCount(0)
                            .build()
            );
        }


        /*
         * Get all submissions for the contest.
         */
        List<Submission> submissions =
                repository.findByContestId(contestId);


        /*
         * Track problems already solved
         * by each user.
         */
        Map<Long, Set<Long>> solvedProblems =
                new HashMap<>();


        for (Submission submission : submissions) {

            /*
             * Only accepted submissions count.
             */
            if (submission.getStatus()
                    != SubmissionStatus.ACCEPTED) {

                continue;
            }


            Long userId =
                    submission.getUser().getId();

            Long problemId =
                    submission.getProblem().getId();


            /*
             * Ignore users who aren't
             * registered participants.
             */
            if (!leaderboard.containsKey(userId)) {
                continue;
            }


            Set<Long> solved =
                    solvedProblems.computeIfAbsent(
                            userId,
                            k -> new HashSet<>()
                    );


            /*
             * A problem can only contribute
             * points once.
             */
            if (solved.contains(problemId)) {
                continue;
            }


            solved.add(problemId);


            ContestLeaderboardResponse entry =
                    leaderboard.get(userId);


            /*
             * Add problem points.
             */
            entry.setScore(
                    entry.getScore()
                            + getPoints(
                            submission
                                    .getProblem()
                                    .getDifficulty()
                    )
            );


            /*
             * Increase solved count.
             */
            entry.setSolvedCount(
                    entry.getSolvedCount() + 1
            );


            /*
             * Track the time when the user
             * solved their latest problem.
             */
            LocalDateTime submittedAt =
                    submission.getSubmittedAt();


            if (
                    entry.getLastAcceptedSubmissionAt()
                            == null
                            ||
                            submittedAt.isAfter(
                                    entry.getLastAcceptedSubmissionAt()
                            )
            ) {

                entry.setLastAcceptedSubmissionAt(
                        submittedAt
                );
            }
        }


        /*
         * Convert map to list.
         */
        List<ContestLeaderboardResponse> result =
                new ArrayList<>(
                        leaderboard.values()
                );


        /*
         * Ranking rules:
         *
         * 1. Higher score first
         * 2. Higher solved count first
         * 3. Earlier final accepted submission first
         * 4. Smaller user ID first as final deterministic fallback
         */
        result.sort(
                Comparator
                        .comparing(
                                ContestLeaderboardResponse
                                        ::getScore
                        )
                        .reversed()

                        .thenComparing(
                                ContestLeaderboardResponse
                                        ::getSolvedCount,
                                Comparator.reverseOrder()
                        )

                        .thenComparing(
                                ContestLeaderboardResponse
                                        ::getLastAcceptedSubmissionAt,
                                Comparator.nullsLast(
                                        Comparator.naturalOrder()
                                )
                        )

                        .thenComparing(
                                ContestLeaderboardResponse
                                        ::getUserId
                        )
        );


        /*
         * Assign final ranks.
         */
        long rank = 1;

        for (ContestLeaderboardResponse entry :
                result) {

            entry.setRank(rank++);
        }


        return result;
    }
}