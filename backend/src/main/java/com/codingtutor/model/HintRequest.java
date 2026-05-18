package com.codingtutor.model;

import jakarta.validation.constraints.NotBlank;

public record HintRequest(
        @NotBlank String prompt,
        ProblemContext context
) {
    public record ProblemContext(
            String site,
            String url,
            String title,
            String statement,
            Long scrapedAt
    ) {}
}
