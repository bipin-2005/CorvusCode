package com.corvuscode.contest.dto.request;

import com.corvuscode.contest.enums.ContestVisibility;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateContestRequest {

    @NotBlank
    private String title;

    private String description;

    @NotNull
    private LocalDateTime registrationStart;

    @NotNull
    private LocalDateTime registrationEnd;

    @NotNull
    private LocalDateTime startTime;

    @NotNull
    private LocalDateTime endTime;

    @NotNull
    private Integer durationMinutes;

    @NotNull
    private ContestVisibility visibility;

    @NotNull
    private Boolean registrationRequired;

    @NotNull
    private Boolean ranked;
}