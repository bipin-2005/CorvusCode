package com.corvuscode.problem.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TagResponse {

    private Long id;

    private String name;
}