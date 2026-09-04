package com.corvuscode.problem.service.impl;

import com.corvuscode.exception.ProblemNotFoundException;
import com.corvuscode.exception.TagAlreadyExistsException;
import com.corvuscode.exception.TagNotFoundException;
import com.corvuscode.problem.dto.TagRequest;
import com.corvuscode.problem.dto.TagResponse;
import com.corvuscode.problem.entity.Problem;
import com.corvuscode.problem.entity.Tag;
import com.corvuscode.problem.mapper.TagMapper;
import com.corvuscode.problem.repository.ProblemRepository;
import com.corvuscode.problem.repository.TagRepository;
import com.corvuscode.problem.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;
    private final ProblemRepository problemRepository;

    @Override
    public TagResponse create(TagRequest request) {

        String tagName = request.getName().trim();

        if (tagRepository.existsByNameIgnoreCase(tagName)) {
            throw new TagAlreadyExistsException("Tag already exists.");
        }

        Tag tag = Tag.builder()
                .name(tagName)
                .build();

        return TagMapper.toResponse(tagRepository.save(tag));
    }

    @Override
    public List<TagResponse> getAll() {

        return tagRepository.findAll()
                .stream()
                .map(TagMapper::toResponse)
                .toList();
    }

    @Override
    public TagResponse getById(Long id) {

        Tag tag = tagRepository.findById(id)
                .orElseThrow(() ->
                        new TagNotFoundException("Tag not found."));

        return TagMapper.toResponse(tag);
    }

    @Override
    public TagResponse update(Long id, TagRequest request) {

        Tag tag = tagRepository.findById(id)
                .orElseThrow(() ->
                        new TagNotFoundException("Tag not found."));

        String tagName = request.getName().trim();

        if (tagRepository.existsByNameIgnoreCase(tagName)
                && !tag.getName().equalsIgnoreCase(tagName)) {

            throw new TagAlreadyExistsException("Tag already exists.");
        }

        tag.setName(tagName);

        return TagMapper.toResponse(tagRepository.save(tag));
    }

    @Override
    public void delete(Long id) {

        Tag tag = tagRepository.findById(id)
                .orElseThrow(() ->
                        new TagNotFoundException("Tag not found."));

        tagRepository.delete(tag);
    }

    @Override
    public void assignTagToProblem(Long problemId, Long tagId) {

        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() ->
                        new ProblemNotFoundException("Problem not found."));

        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() ->
                        new TagNotFoundException("Tag not found."));

        if (!problem.getTags().contains(tag)) {
            problem.getTags().add(tag);
            problemRepository.save(problem);
        }
    }

    @Override
    public void removeTagFromProblem(Long problemId, Long tagId) {

        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() ->
                        new ProblemNotFoundException("Problem not found."));

        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() ->
                        new TagNotFoundException("Tag not found."));

        problem.getTags().remove(tag);

        problemRepository.save(problem);
    }

    @Override
    public List<TagResponse> getTagsByProblem(Long problemId) {

        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() ->
                        new ProblemNotFoundException("Problem not found."));

        return problem.getTags()
                .stream()
                .map(TagMapper::toResponse)
                .toList();
    }
}