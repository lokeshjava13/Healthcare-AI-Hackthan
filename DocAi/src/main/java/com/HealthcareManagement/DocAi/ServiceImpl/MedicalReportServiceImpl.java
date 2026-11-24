package com.HealthcareManagement.DocAi.ServiceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.HealthcareManagement.DocAi.Entity.MedicalReport;
import com.HealthcareManagement.DocAi.Repo.MedicalReportRepository;
import com.HealthcareManagement.DocAi.service.MedicalReportService;

@Service
public class MedicalReportServiceImpl implements MedicalReportService {

    @Autowired
    private MedicalReportRepository medicalReportRepository;

    @Override
    public MedicalReport saveMedicalReport(MedicalReport report) {
        return medicalReportRepository.save(report);
    }

    @Override
    public List<MedicalReport> getAllMedicalReports() {
        return medicalReportRepository.findAll();
    }

    @Override
    public MedicalReport getMedicalReportById(Long id) {
        return medicalReportRepository.findById(id).orElse(null);
    }

    @Override
    public MedicalReport updateMedicalReport(Long id, MedicalReport report) {
        if (medicalReportRepository.existsById(id)) {
            report.setId(id);
            return medicalReportRepository.save(report);
        }
        return null;
    }

    @Override
    public void deleteMedicalReport(Long id) {
        medicalReportRepository.deleteById(id);
    }
}