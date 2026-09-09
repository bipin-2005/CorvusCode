package com.corvuscode.problem.seed;

import com.corvuscode.problem.startercode.enums.ProgrammingLanguage;
import lombok.Data;

@Data
public class StarterCodeSeedData {

    private ProgrammingLanguage language;
    private String templateCode;
}