package com.corvuscode.submission.controller;

import com.corvuscode.problem.startercode.enums.ProgrammingLanguage;
import com.corvuscode.submission.client.JudgeClient;
import com.corvuscode.submission.dto.JudgeRequest;
import com.corvuscode.submission.dto.JudgeResponse;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class JudgeTestController {

    private final JudgeClient judgeClient;

    public JudgeTestController(JudgeClient judgeClient) {
        this.judgeClient = judgeClient;
    }

    @PostMapping("/judge")
    public JudgeResponse testJudge() {

        JudgeRequest request = JudgeRequest.builder()
                .language(ProgrammingLanguage.JAVA)
                .sourceCode("""
                        public class Main {
                            public static void main(String[] args) {
                                System.out.println("Backend Connected");
                            }
                        }
                        """)
                .stdin("")
                .build();

        return judgeClient.execute(request);
    }
}