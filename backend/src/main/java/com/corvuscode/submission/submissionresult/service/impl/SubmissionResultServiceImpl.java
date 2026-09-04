package com.corvuscode.submission.submissionresult.service.impl;

import com.corvuscode.submission.entity.Submission;
import com.corvuscode.submission.exception.SubmissionNotFoundException;
import com.corvuscode.submission.repository.SubmissionRepository;
import com.corvuscode.submission.submissionresult.dto.SubmissionResultResponse;
import com.corvuscode.submission.submissionresult.entity.SubmissionResult;
import com.corvuscode.submission.submissionresult.mapper.SubmissionResultMapper;
import com.corvuscode.submission.submissionresult.repository.SubmissionResultRepository;
import com.corvuscode.submission.submissionresult.service.SubmissionResultService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import com.corvuscode.auth.entity.User;
import com.corvuscode.auth.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;

@Service
public class SubmissionResultServiceImpl
        implements SubmissionResultService {

    private final SubmissionResultRepository repository;
    private final SubmissionRepository submissionRepository;
    private final SubmissionResultMapper mapper;
    private final UserRepository userRepository;

    public SubmissionResultServiceImpl(
            SubmissionResultRepository repository,
            SubmissionRepository submissionRepository,
            SubmissionResultMapper mapper,
            UserRepository userRepository) {

        this.repository = repository;
        this.submissionRepository = submissionRepository;
        this.mapper = mapper;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public SubmissionResultResponse getById(Long id) {

        SubmissionResult result = repository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Submission Result not found."
                        ));

        Submission submission = result.getSubmission();

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new EntityNotFoundException("User not found."));

        if (!submission.getUser().getId().equals(user.getId())) {
            throw new EntityNotFoundException(
                    "Submission Result not found."
            );
        }

        return mapper.toResponse(result);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubmissionResultResponse> getBySubmission(
            Long submissionId) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new EntityNotFoundException("User not found."));

        Submission submission =
                submissionRepository.findByIdAndUser(
                                submissionId,
                                user
                        )
                        .orElseThrow(() ->
                                new SubmissionNotFoundException(submissionId));

        return repository.findBySubmission(submission)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }
}