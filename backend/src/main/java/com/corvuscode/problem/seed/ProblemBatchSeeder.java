package com.corvuscode.problem.seed;

import com.corvuscode.problem.entity.Problem;
import com.corvuscode.problem.entity.ProblemExample;
import com.corvuscode.problem.entity.Tag;
import com.corvuscode.problem.repository.ProblemRepository;
import com.corvuscode.problem.repository.TagRepository;
import com.corvuscode.problem.startercode.entity.StarterCode;
import com.corvuscode.problem.startercode.enums.ProgrammingLanguage;
import com.corvuscode.problem.testcase.entity.TestCase;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
@Profile("problem-seed")
@RequiredArgsConstructor
public class ProblemBatchSeeder implements CommandLineRunner {

    private final ProblemRepository problemRepository;
    private final TagRepository tagRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public void run(String... args) throws Exception {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("     CORVUSCODE PROBLEM BATCH SEEDER");
        System.out.println("==========================================");

        ClassPathResource resource =
                new ClassPathResource("problem-data/problems.json");

        try (InputStream inputStream = resource.getInputStream()) {

            List<ProblemSeedData> problems =
                    objectMapper.readValue(
                            inputStream,
                            new TypeReference<List<ProblemSeedData>>() {
                            }
                    );

            int created = 0;
            int skipped = 0;

            for (ProblemSeedData data : problems) {

                if (problemRepository.existsBySlug(data.getSlug())) {

                    System.out.println(
                            "[SKIPPED] " +
                                    data.getTitle() +
                                    " -> slug already exists"
                    );

                    skipped++;
                    continue;
                }

                createProblem(data);

                System.out.println(
                        "[CREATED] " +
                                data.getTitle()
                );

                created++;
            }

            System.out.println();
            System.out.println("------------------------------------------");
            System.out.println("Total  : " + problems.size());
            System.out.println("Created: " + created);
            System.out.println("Skipped: " + skipped);
            System.out.println("------------------------------------------");
            System.out.println("Problem batch import completed.");
            System.out.println("==========================================");
            System.out.println();
        }
    }

    private void createProblem(ProblemSeedData data) {

        Problem problem = Problem.builder()
                .title(data.getTitle())
                .slug(data.getSlug())
                .difficulty(data.getDifficulty())
                .description(data.getDescription())
                .constraints(data.getConstraints())
                .inputFormat(data.getInputFormat())
                .outputFormat(data.getOutputFormat())
                .explanation(data.getExplanation())
                .timeLimit(
                        data.getTimeLimit() != null
                                ? data.getTimeLimit()
                                : 1000
                )
                .memoryLimit(
                        data.getMemoryLimit() != null
                                ? data.getMemoryLimit()
                                : 256
                )
                .active(
                        data.getActive() != null
                                ? data.getActive()
                                : true
                )
                .build();

        /*
         * ----------------------------------------
         * TAGS
         * ----------------------------------------
         */

        List<Tag> tags = new ArrayList<>();

        if (data.getTags() != null) {

            Set<String> uniqueTags =
                    new HashSet<>(data.getTags());

            for (String tagName : uniqueTags) {

                if (tagName == null || tagName.isBlank()) {
                    continue;
                }

                String normalizedName =
                        tagName.trim();

                Tag tag =
                        tagRepository
                                .findByNameIgnoreCase(normalizedName)
                                .orElseGet(() ->
                                        tagRepository.save(
                                                Tag.builder()
                                                        .name(normalizedName)
                                                        .build()
                                        )
                                );

                tags.add(tag);
            }
        }

        problem.setTags(tags);

        /*
         * ----------------------------------------
         * EXAMPLES
         * ----------------------------------------
         */

        if (data.getExamples() != null) {

            for (ExampleSeedData exampleData :
                    data.getExamples()) {

                ProblemExample example =
                        ProblemExample.builder()
                                .input(exampleData.getInput())
                                .output(exampleData.getOutput())
                                .explanation(
                                        exampleData.getExplanation()
                                )
                                .problem(problem)
                                .build();

                problem.getExamples().add(example);
            }
        }

        /*
         * ----------------------------------------
         * TEST CASES
         * ----------------------------------------
         */

        if (data.getTestCases() != null) {

            for (TestCaseSeedData testCaseData :
                    data.getTestCases()) {

                TestCase testCase =
                        TestCase.builder()
                                .input(testCaseData.getInput())
                                .expectedOutput(
                                        testCaseData.getExpectedOutput()
                                )
                                .type(testCaseData.getType())
                                .explanation(
                                        testCaseData.getExplanation()
                                )
                                .problem(problem)
                                .build();

                problem.getTestCases().add(testCase);
            }
        }

        /*
         * ----------------------------------------
         * STARTER CODES
         *
         * ONLY:
         * JAVA
         * PYTHON
         * CPP
         * ----------------------------------------
         */

        if (data.getStarterCodes() != null) {

            Set<ProgrammingLanguage> addedLanguages =
                    new HashSet<>();

            for (StarterCodeSeedData starterData :
                    data.getStarterCodes()) {

                ProgrammingLanguage language =
                        starterData.getLanguage();

                if (language == null) {
                    continue;
                }

                if (!Set.of(
                        ProgrammingLanguage.JAVA,
                        ProgrammingLanguage.PYTHON,
                        ProgrammingLanguage.CPP
                ).contains(language)) {

                    continue;
                }

                if (!addedLanguages.add(language)) {
                    continue;
                }

                StarterCode starterCode =
                        StarterCode.builder()
                                .language(language)
                                .templateCode(
                                        starterData.getTemplateCode()
                                )
                                .problem(problem)
                                .build();

                problem.getStarterCodes()
                        .add(starterCode);
            }
        }

        /*
         * ----------------------------------------
         * SAVE EVERYTHING
         * ----------------------------------------
         *
         * Problem has CascadeType.ALL for:
         * - examples
         * - testCases
         * - starterCodes
         */

        problemRepository.save(problem);
    }
}