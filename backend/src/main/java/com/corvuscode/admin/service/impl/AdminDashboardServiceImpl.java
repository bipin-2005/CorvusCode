package com.corvuscode.admin.service.impl;

import com.corvuscode.admin.dto.DashboardStatsResponse;
import com.corvuscode.admin.service.AdminDashboardService;
import com.corvuscode.auth.repository.UserRepository;
import com.corvuscode.contest.enums.ContestStatus;
import com.corvuscode.contest.repository.ContestRepository;
import com.corvuscode.problem.repository.ProblemRepository;
import com.corvuscode.submission.enums.SubmissionStatus;
import com.corvuscode.submission.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminDashboardServiceImpl
        implements AdminDashboardService {

    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;
    private final ContestRepository contestRepository;
    private final SubmissionRepository submissionRepository;

    @Override
    public DashboardStatsResponse getDashboardStats() {

        return DashboardStatsResponse.builder()
                .totalUsers(userRepository.count())
                .verifiedUsers(userRepository.countByEnabledTrue())

                .totalProblems(problemRepository.count())

                .totalContests(contestRepository.count())
                .activeContests(
                        contestRepository.countByStatus(
                                ContestStatus.RUNNING
                        )
                )

                .totalSubmissions(submissionRepository.count())
                .acceptedSubmissions(
                        submissionRepository.countByStatus(
                                SubmissionStatus.ACCEPTED
                        )
                )
                .build();
    }
}