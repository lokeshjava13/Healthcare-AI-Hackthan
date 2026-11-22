package com.HealthcareManagement.DocAi.ServiceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.HealthcareManagement.DocAi.Entity.MedicalHistory;
import com.HealthcareManagement.DocAi.Repo.MedicalHistoryRepository;
import com.HealthcareManagement.DocAi.service.MedicalHistoryService;

@Service
public class MedicalHistoryServiceImpl implements MedicalHistoryService {

    @Autowired
    private MedicalHistoryRepository medicalHistoryRepository;

    @Override
    public MedicalHistory saveMedicalHistory(MedicalHistory history) {
        return medicalHistoryRepository.save(history);
    }

    @Override
    public List<MedicalHistory> getAllMedicalHistories() {
        return medicalHistoryRepository.findAll();
    }

    @Override
    public MedicalHistory getMedicalHistoryById(Long id) {
        return medicalHistoryRepository.findById(id).orElse(null);
    }

    @Override
    public MedicalHistory updateMedicalHistory(Long id, MedicalHistory history) {
        if (medicalHistoryRepository.existsById(id)) {
            history.setId(id);
            return medicalHistoryRepository.save(history);
        }
        return null;
    }

    @Override
    public void deleteMedicalHistory(Long id) {
        medicalHistoryRepository.deleteById(id);
    }
}