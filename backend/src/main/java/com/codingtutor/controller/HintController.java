package com.codingtutor.controller;

import com.codingtutor.model.HintRequest;
import com.codingtutor.model.HintResponse;
import com.codingtutor.service.GeminiService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HintController {

    private final GeminiService gemini;

    public HintController(GeminiService gemini) {
        this.gemini = gemini;
    }

    @PostMapping("/hint")
    public HintResponse hint(@Valid @RequestBody HintRequest request) {
        String hint = gemini.getHint(request);
        return new HintResponse(hint);
    }
}
