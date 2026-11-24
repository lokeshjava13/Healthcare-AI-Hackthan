package com.HealthcareManagement.DocAi.service;

import org.springframework.web.multipart.MultipartFile;
import com.HealthcareManagement.DocAi.dto.response.AiAnalysisResponse;

public interface AiService {

    AiAnalysisResponse analyzeMedicalReport(MultipartFile file);

    String askMedicalQuestion(String question);
}