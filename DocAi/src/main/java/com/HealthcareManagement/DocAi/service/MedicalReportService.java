package com.HealthcareManagement.DocAi.service;

import java.util.List;
import com.HealthcareManagement.DocAi.Entity.MedicalReport;

public interface MedicalReportService {

    MedicalReport saveMedicalReport(MedicalReport report);

    List<MedicalReport> getAllMedicalReports();

    MedicalReport getMedicalReportById(Long id);

    MedicalReport updateMedicalReport(Long id, MedicalReport report);

    void deleteMedicalReport(Long id);
}