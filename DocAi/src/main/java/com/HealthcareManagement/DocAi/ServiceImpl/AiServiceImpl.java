package com.HealthcareManagement.DocAi.ServiceImpl;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.HealthcareManagement.DocAi.service.AiService;
import com.HealthcareManagement.DocAi.dto.response.AiAnalysisResponse;

@Service
public class AiServiceImpl implements AiService {

    private final ChatClient chatClient;

    public AiServiceImpl(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    @Override
    public String askMedicalQuestion(String question) {

        return chatClient.prompt()
                .system("""
                    You are a healthcare information assistant.
                    Explain medical terms and provide general health information.
                    Do not provide definitive diagnoses or prescribe medicines.
                    Encourage users to consult qualified doctors.
                    For emergency symptoms, advise immediate medical care.
                    """)
                .user(question)
                .call()
                .content();
    }

    @Override
    public AiAnalysisResponse analyzeMedicalReport(MultipartFile file) {

        return null; // We will implement report analysis next.
    }
}