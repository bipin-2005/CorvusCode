package com.corvuscode.judgeservice.service;

import com.corvuscode.judgeservice.dto.JudgeRequest;
import com.corvuscode.judgeservice.dto.JudgeResponse;

public interface JudgeService {

    JudgeResponse execute(JudgeRequest request);

}