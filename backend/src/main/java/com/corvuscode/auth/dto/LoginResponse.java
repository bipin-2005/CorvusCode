package com.corvuscode.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private String token;
    private String fullName;
    private String email;
    private List<String> roles;
}