package com.codingtutor.service;

import com.codingtutor.model.HintRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

/**
 * Thin wrapper over Anthropic's Messages API.
 *
 * Returns a single response string. Streaming (SSE) is intentionally
 * deferred — see {@code useHintStream} on the frontend, which is shaped
 * to swap to SSE without changing callers.
 */
@Service
public class ClaudeService {

    private static final String SYSTEM_PROMPT = """
            You are a Socratic coding tutor. The student is solving a competitive programming
            problem. Do NOT reveal the full solution. Give one focused hint that nudges them
            toward the next step. Ask a clarifying question when their intent is ambiguous.
            Keep responses under 150 words.
            """;

    private final RestClient http;
    private final String apiKey;
    private final String model;
    private final int maxTokens;

    public ClaudeService(
            @Value("${claude.api-key}") String apiKey,
            @Value("${claude.model}") String model,
            @Value("${claude.base-url}") String baseUrl,
            @Value("${claude.max-tokens}") int maxTokens
    ) {
        this.apiKey = apiKey;
        this.model = model;
        this.maxTokens = maxTokens;
        this.http = RestClient.builder().baseUrl(baseUrl).build();
    }

    public String getHint(HintRequest req) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("ANTHROPIC_API_KEY is not configured");
        }

        String userMessage = buildUserMessage(req);

        Map<String, Object> body = Map.of(
                "model", model,
                "max_tokens", maxTokens,
                "system", SYSTEM_PROMPT,
                "messages", List.of(
                        Map.of("role", "user", "content", userMessage)
                )
        );

        Map<?, ?> resp = http.post()
                .uri("/v1/messages")
                .header("x-api-key", apiKey)
                .header("anthropic-version", "2023-06-01")
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(Map.class);

        return extractText(resp);
    }

    private static String buildUserMessage(HintRequest req) {
        StringBuilder sb = new StringBuilder();
        if (req.context() != null) {
            sb.append("Problem: ").append(nullSafe(req.context().title())).append("\n");
            sb.append("Source: ").append(nullSafe(req.context().site())).append("\n\n");
            sb.append("Statement:\n").append(nullSafe(req.context().statement())).append("\n\n");
        }
        sb.append("Student question:\n").append(req.prompt());
        return sb.toString();
    }

    private static String nullSafe(String s) {
        return s == null ? "" : s;
    }

    @SuppressWarnings("unchecked")
    private static String extractText(Map<?, ?> resp) {
        if (resp == null) return "";
        Object content = resp.get("content");
        if (!(content instanceof List<?> blocks) || blocks.isEmpty()) return "";
        Object first = blocks.get(0);
        if (first instanceof Map<?, ?> block) {
            Object text = ((Map<String, Object>) block).get("text");
            return text == null ? "" : text.toString();
        }
        return "";
    }
}
