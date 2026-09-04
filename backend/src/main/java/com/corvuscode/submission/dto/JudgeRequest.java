package com.corvuscode.submission.dto;

import com.corvuscode.problem.startercode.enums.ProgrammingLanguage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JudgeRequest {

    private String sourceCode;

    private ProgrammingLanguage language;

    private String stdin;

}