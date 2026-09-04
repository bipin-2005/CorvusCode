package com.corvuscode.leaderboard.service.impl;

import com.corvuscode.leaderboard.dto.response.LeaderboardResponse;
import com.corvuscode.leaderboard.repository.LeaderboardRepository;
import com.corvuscode.leaderboard.service.LeaderboardService;
import com.corvuscode.problem.entity.Difficulty;
import com.corvuscode.submission.entity.Submission;
import com.corvuscode.submission.enums.SubmissionStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

@Service
@RequiredArgsConstructor
public class LeaderboardServiceImpl
        implements LeaderboardService {

    private final LeaderboardRepository repository;

    @Override
    public List<LeaderboardResponse> getLeaderboard() {

        List<Submission> submissions =
                repository.findAllWithUserAndProblem();

        Map<Long, Set<Long>> solvedProblems =
                new HashMap<>();

        Map<Long, LeaderboardResponse> leaderboard =
                new HashMap<>();

        for (Submission submission : submissions) {

            if (submission.getStatus()
                    != SubmissionStatus.ACCEPTED) {
                continue;
            }

            Long userId =
                    submission.getUser().getId();

            Long problemId =
                    submission.getProblem().getId();

            solvedProblems.putIfAbsent(
                    userId,
                    new HashSet<>()
            );

            if (!solvedProblems
                    .get(userId)
                    .add(problemId)) {
                continue;
            }

            LeaderboardResponse entry =
                    leaderboard.computeIfAbsent(
                            userId,
                            id -> LeaderboardResponse.builder()
                                    .userId(id)
                                    .fullName(
                                            submission.getUser()
                                                    .getFullName()
                                    )
                                    .score(0)
                                    .solvedCount(0)
                                    .build()
                    );

            entry.setScore(
                    entry.getScore()
                            + getPoints(
                            submission.getProblem()
                                    .getDifficulty()
                    )
            );

            entry.setSolvedCount(
                    entry.getSolvedCount() + 1
            );
        }

        List<LeaderboardResponse> result =
                new ArrayList<>(leaderboard.values());

        result.sort(
                Comparator
                        .comparing(
                                LeaderboardResponse::getScore
                        )
                        .reversed()
                        .thenComparing(
                                LeaderboardResponse::getSolvedCount,
                                Comparator.reverseOrder()
                        )
        );

        AtomicLong rank = new AtomicLong(1);

        result.forEach(entry ->
                entry.setRank(
                        rank.getAndIncrement()
                )
        );

        return result;
    }

    private int getPoints(Difficulty difficulty) {
        return switch (difficulty) {
            case EASY -> 100;
            case MEDIUM -> 200;
            case HARD -> 300;
        };
    }
}