package com.corvuscode.problem.startercode.mapper;

import com.corvuscode.problem.startercode.dto.StarterCodeRequest;
import com.corvuscode.problem.startercode.dto.StarterCodeResponse;
import com.corvuscode.problem.startercode.entity.StarterCode;
import org.springframework.stereotype.Component;

@Component
public class StarterCodeMapper {

    public StarterCode toEntity(StarterCodeRequest request) {

        return StarterCode.builder()
                .language(request.getLanguage())
                .templateCode(request.getTemplateCode())
                .build();
    }

    public StarterCodeResponse toResponse(StarterCode starterCode) {

        return StarterCodeResponse.builder()
                .id(starterCode.getId())
                .language(starterCode.getLanguage())
                .templateCode(starterCode.getTemplateCode())
                .problemId(starterCode.getProblem().getId())
                .build();
    }
}