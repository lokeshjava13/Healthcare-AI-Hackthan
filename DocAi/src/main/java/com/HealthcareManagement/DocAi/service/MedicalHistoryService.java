package com.HealthcareManagement.DocAi.service;

import java.util.List;
import com.HealthcareManagement.DocAi.Entity.MedicalHistory;

public interface MedicalHistoryService {

    MedicalHistory saveMedicalHistory(MedicalHistory history);

    List<MedicalHistory> getAllMedicalHistories();

    MedicalHistory getMedicalHistoryById(Long id);

    MedicalHistory updateMedicalHistory(Long id, MedicalHistory history);

    void deleteMedicalHistory(Long id);
}