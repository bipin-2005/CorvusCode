package com.corvuscode.submission.client;

import com.corvuscode.submission.dto.JudgeRequest;
import com.corvuscode.submission.dto.JudgeResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class JudgeClient {

    private final RestClient restClient;

    public JudgeClient(
            @Value("${judge.service.url}") String judgeUrl) {

        this.restClient = RestClient.builder()
                .baseUrl(judgeUrl)
                .build();
    }

    public JudgeResponse execute(JudgeRequest request) {

        return restClient.post()
                .uri("/api/judge/run")
                .body(request)
                .retrieve()
                .body(JudgeResponse.class);
    }

}