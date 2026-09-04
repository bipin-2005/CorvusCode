package com.corvuscode.contest.controller;

import com.corvuscode.auth.entity.User;
import com.corvuscode.auth.repository.UserRepository;
import com.corvuscode.contest.dto.request.CreateContestRequest;
import com.corvuscode.contest.dto.request.UpdateContestRequest;
import com.corvuscode.contest.dto.response.ContestResponse;
import com.corvuscode.contest.service.ContestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contests")
@RequiredArgsConstructor
public class ContestController {

    private final ContestService contestService;

    private final UserRepository userRepository;


    /* =========================================================
       CREATE CONTEST
    ========================================================= */

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContestResponse createContest(
            @Valid @RequestBody CreateContestRequest request,
            Authentication authentication
    ) {

        return contestService.createContest(
                request,
                authentication.getName()
        );
    }


    /* =========================================================
       GET CONTEST
    ========================================================= */

    @GetMapping("/{contestId}")
    public ResponseEntity<ContestResponse> getContest(
            @PathVariable Long contestId,
            Authentication authentication
    ) {

        String email =
                authentication.getName();


        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        return ResponseEntity.ok(
                contestService.getContest(
                        contestId,
                        user.getId()
                )
        );
    }


    /* =========================================================
       GET ALL CONTESTS
    ========================================================= */

    @GetMapping
    public Page<ContestResponse> getAllContests(

            @RequestParam(
                    defaultValue = "0"
            )
            int page,

            @RequestParam(
                    defaultValue = "10"
            )
            int size,

            @RequestParam(
                    defaultValue = "startTime"
            )
            String sortBy,

            @RequestParam(
                    defaultValue = "asc"
            )
            String direction

    ) {

        return contestService.getAllContests(
                page,
                size,
                sortBy,
                direction
        );
    }


    /* =========================================================
       UPDATE CONTEST
    ========================================================= */

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{contestId}")
    public ContestResponse updateContest(
            @PathVariable Long contestId,
            @RequestBody UpdateContestRequest request
    ) {

        return contestService.updateContest(
                contestId,
                request
        );
    }


    /* =========================================================
       DELETE CONTEST
    ========================================================= */

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{contestId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteContest(
            @PathVariable Long contestId
    ) {

        contestService.deleteContest(
                contestId
        );
    }


    /* =========================================================
       PUBLISH CONTEST
    ========================================================= */

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{contestId}/publish")
    public void publishContest(
            @PathVariable Long contestId
    ) {

        contestService.publishContest(
                contestId
        );
    }


    /* =========================================================
       CANCEL CONTEST
    ========================================================= */

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{contestId}/cancel")
    public void cancelContest(
            @PathVariable Long contestId
    ) {

        contestService.cancelContest(
                contestId
        );
    }


    /* =========================================================
       FINALIZE CONTEST
    ========================================================= */

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{contestId}/finalize")
    public ResponseEntity<Void> finalizeContest(
            @PathVariable Long contestId
    ) {

        contestService.finalizeContest(
                contestId
        );

        return ResponseEntity.ok().build();
    }
}