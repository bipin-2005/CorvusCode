package com.corvuscode.judgeservice.controller;

import com.corvuscode.judgeservice.dto.JudgeRequest;
import com.corvuscode.judgeservice.dto.JudgeResponse;
import com.corvuscode.judgeservice.service.JudgeService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/judge")
public class JudgeController {

    private final JudgeService judgeService;

    public JudgeController(JudgeService judgeService) {
        this.judgeService = judgeService;
    }



    @PostMapping("/run")
    public JudgeResponse run(@Valid @RequestBody JudgeRequest request) {

        System.out.println("Language: " + request.getLanguage());

        return judgeService.execute(request);
    }
}