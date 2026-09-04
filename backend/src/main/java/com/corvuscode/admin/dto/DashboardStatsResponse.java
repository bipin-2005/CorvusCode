package com.corvuscode.admin.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsResponse {

    private long totalUsers;

    private long verifiedUsers;

    private long totalProblems;

    private long totalContests;

    private long activeContests;

    private long totalSubmissions;

    private long acceptedSubmissions;
}
