package com.corvuscode.problem.controller;

import com.corvuscode.problem.dto.TagRequest;
import com.corvuscode.problem.dto.TagResponse;
import com.corvuscode.problem.service.TagService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    // -----------------------
    // Tag CRUD
    // -----------------------

    @PostMapping("/tags")
    @ResponseStatus(HttpStatus.CREATED)
    public TagResponse createTag(
            @Valid @RequestBody TagRequest request) {

        return tagService.create(request);
    }

    @GetMapping("/tags")
    public List<TagResponse> getAllTags() {

        return tagService.getAll();
    }

    @GetMapping("/tags/{id}")
    public TagResponse getTagById(
            @PathVariable Long id) {

        return tagService.getById(id);
    }

    @PutMapping("/tags/{id}")
    public TagResponse updateTag(
            @PathVariable Long id,
            @Valid @RequestBody TagRequest request) {

        return tagService.update(id, request);
    }

    @DeleteMapping("/tags/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTag(
            @PathVariable Long id) {

        tagService.delete(id);
    }

    // -----------------------
    // Problem ↔ Tag
    // -----------------------

    @PostMapping("/problems/{problemId}/tags/{tagId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void assignTag(
            @PathVariable Long problemId,
            @PathVariable Long tagId) {

        tagService.assignTagToProblem(problemId, tagId);
    }

    @DeleteMapping("/problems/{problemId}/tags/{tagId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeTag(
            @PathVariable Long problemId,
            @PathVariable Long tagId) {

        tagService.removeTagFromProblem(problemId, tagId);
    }

    @GetMapping("/problems/{problemId}/tags")
    public List<TagResponse> getProblemTags(
            @PathVariable Long problemId) {

        return tagService.getTagsByProblem(problemId);
    }
}