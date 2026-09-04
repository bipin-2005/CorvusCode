package com.corvuscode.problem.startercode.dto;

import com.corvuscode.problem.startercode.enums.ProgrammingLanguage;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StarterCodeRequest {

    @NotNull(message = "Language is required.")
    private ProgrammingLanguage language;

    @NotBlank(message = "Template code is required.")
    private String templateCode;

    @NotNull(message = "Problem ID is required.")
    private Long problemId;
}