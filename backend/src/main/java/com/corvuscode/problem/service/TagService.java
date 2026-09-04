package com.corvuscode.problem.service;

import com.corvuscode.problem.dto.TagRequest;
import com.corvuscode.problem.dto.TagResponse;

import java.util.List;

public interface TagService {

    TagResponse create(TagRequest request);

    List<TagResponse> getAll();

    TagResponse getById(Long id);

    TagResponse update(Long id, TagRequest request);

    void delete(Long id);

    void assignTagToProblem(Long problemId, Long tagId);

    void removeTagFromProblem(Long problemId, Long tagId);

    List<TagResponse> getTagsByProblem(Long problemId);
}