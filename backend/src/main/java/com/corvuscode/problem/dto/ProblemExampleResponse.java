package com.corvuscode.problem.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProblemExampleResponse {

    private Long id;

    private String input;

    private String output;

    private String explanation;
}