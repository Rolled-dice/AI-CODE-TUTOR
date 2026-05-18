package com.codingtutor.service;

import com.codingtutor.model.HintRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

/**
 * Thin wrapper over Google's Gemini generateContent API.
 *
 * Returns a single response string. Streaming is deferred — see
 * {@code useHintStream} on the frontend.
 */
@Service
public class GeminiService {

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

    public GeminiService(
            @Value("${gemini.api-key}") String apiKey,
            @Value("${gemini.model}") String model,
            @Value("${gemini.base-url}") String baseUrl,
            @Value("${gemini.max-tokens}") int maxTokens
    ) {
        this.apiKey = apiKey;
        this.model = model;
        this.maxTokens = maxTokens;
        this.http = RestClient.builder().baseUrl(baseUrl).build();
    }

    public String getHint(HintRequest req) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("GEMINI_API_KEY is not configured");
        }

        String userMessage = buildUserMessage(req);

        // Gemini generateContent request body
        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("role", "user", "parts", List.of(Map.of("text", userMessage)))
                ),
                "systemInstruction", Map.of(
                        "parts", List.of(Map.of("text", SYSTEM_PROMPT))
                ),
                "generationConfig", Map.of(
                        "maxOutputTokens", maxTokens
                )
        );

        Map<?, ?> resp = http.post()
                .uri("/v1beta/models/{model}:generateContent?key={key}", model, apiKey)
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
        Object candidates = resp.get("candidates");
        if (!(candidates instanceof List<?> list) || list.isEmpty()) return "";
        Object first = list.get(0);
        if (!(first instanceof Map<?, ?> candidate)) return "";
        Object content = candidate.get("content");
        if (!(content instanceof Map<?, ?> contentMap)) return "";
        Object parts = contentMap.get("parts");
        if (!(parts instanceof List<?> partsList) || partsList.isEmpty()) return "";
        Object part = partsList.get(0);
        if (!(part instanceof Map<?, ?> partMap)) return "";
        Object text = partMap.get("text");
        return text == null ? "" : text.toString();
    }
}
