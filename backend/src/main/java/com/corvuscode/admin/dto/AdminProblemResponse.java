package com.corvuscode.admin.dto;

import com.corvuscode.problem.entity.Difficulty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminProblemResponse {

    private Long id;
    private String title;
    private String slug;
    private Difficulty difficulty;
    private Boolean active;
}