package com.corvuscode.profile.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @NotBlank(message = "Full name is required")
    @Size(max = 100, message = "Full name must be at most 100 characters")
    private String fullName;

    @Size(max = 500, message = "Bio must be at most 500 characters")
    private String bio;

    @Size(max = 50, message = "Country must be at most 50 characters")
    private String country;

    @Size(max = 500, message = "Avatar URL must be at most 500 characters")
    private String avatarUrl;

    @Size(max = 255, message = "GitHub URL must be at most 255 characters")
    private String githubUrl;

    @Size(max = 255, message = "LinkedIn URL must be at most 255 characters")
    private String linkedinUrl;

    @Size(max = 255, message = "Website URL must be at most 255 characters")
    private String websiteUrl;
}
