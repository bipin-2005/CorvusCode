package com.corvuscode.contest.dto.response;

import com.corvuscode.contest.enums.ContestStatus;
import com.corvuscode.contest.enums.ContestVisibility;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContestResponse {

    private Long id;

    private String title;

    private String description;

    private LocalDateTime registrationStart;

    private LocalDateTime registrationEnd;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Integer durationMinutes;

    private ContestStatus status;

    private ContestVisibility visibility;

    private Boolean registrationRequired;

    private Boolean ranked;

    private Long createdBy;

    /*
     * User has registered for the contest.
     */
    private Boolean registered;

    /*
     * User has actually entered the contest.
     */
    private Boolean participating;

    /*
     * Total number of users who entered
     * the contest.
     */
    private Long participantCount;
}