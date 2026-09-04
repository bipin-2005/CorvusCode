package com.corvuscode.problem.mapper;

import com.corvuscode.problem.dto.TagRequest;
import com.corvuscode.problem.dto.TagResponse;
import com.corvuscode.problem.entity.Tag;

public class TagMapper {

    public static Tag toEntity(TagRequest request) {

        return Tag.builder()
                .name(request.getName().trim())
                .build();
    }

    public static TagResponse toResponse(Tag tag) {

        return TagResponse.builder()
                .id(tag.getId())
                .name(tag.getName())
                .build();
    }
}