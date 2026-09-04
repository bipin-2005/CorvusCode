package com.corvuscode.problem.startercode.dto;

import com.corvuscode.problem.startercode.enums.ProgrammingLanguage;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StarterCodeResponse {

    private Long id;

    private ProgrammingLanguage language;

    private String templateCode;

    private Long problemId;
}