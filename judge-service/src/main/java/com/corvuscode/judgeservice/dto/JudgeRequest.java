package com.corvuscode.judgeservice.dto;

import com.corvuscode.judgeservice.enums.SupportedLanguage;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@Builder
public class JudgeRequest {

    private String sourceCode;

    private String stdin;

    private SupportedLanguage language;
}