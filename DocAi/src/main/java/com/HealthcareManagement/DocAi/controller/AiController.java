package com.HealthcareManagement.DocAi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.HealthcareManagement.DocAi.service.AiService;
import com.HealthcareManagement.DocAi.dto.response.AiAnalysisResponse;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiController {

    @Autowired
    private AiService aiService;

    @PostMapping("/ask")
    public ResponseEntity<String> askMedicalQuestion(
            @RequestParam String question) {

        return ResponseEntity.ok(
                aiService.askMedicalQuestion(question));
    }

    @PostMapping("/analyze")
    public ResponseEntity<AiAnalysisResponse> analyzeMedicalReport(
            @RequestParam("file") MultipartFile file) {

        return ResponseEntity.ok(
                aiService.analyzeMedicalReport(file));
    }
}