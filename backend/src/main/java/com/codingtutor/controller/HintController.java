package com.codingtutor.controller;

import com.codingtutor.model.HintRequest;
import com.codingtutor.model.HintResponse;
import com.codingtutor.service.ClaudeService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HintController {

    private final ClaudeService claude;

    public HintController(ClaudeService claude) {
        this.claude = claude;
    }

    @PostMapping("/hint")
    public HintResponse hint(@Valid @RequestBody HintRequest request) {
        String hint = claude.getHint(request);
        return new HintResponse(hint);
    }
}
