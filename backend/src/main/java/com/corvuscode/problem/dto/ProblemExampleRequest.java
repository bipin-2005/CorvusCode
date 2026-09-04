package com.corvuscode.problem.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProblemExampleRequest {

    @NotBlank(message = "Input is required.")
    private String input;

    @NotBlank(message = "Output is required.")
    private String output;

    private String explanation;
}