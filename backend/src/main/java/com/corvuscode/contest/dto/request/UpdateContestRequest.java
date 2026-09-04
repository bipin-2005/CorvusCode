package com.corvuscode.contest.dto.request;

import com.corvuscode.contest.enums.ContestVisibility;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateContestRequest {

    private String title;

    private String description;

    private LocalDateTime registrationStart;

    private LocalDateTime registrationEnd;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Integer durationMinutes;

    private ContestVisibility visibility;

    private Boolean registrationRequired;

    private Boolean ranked;
}