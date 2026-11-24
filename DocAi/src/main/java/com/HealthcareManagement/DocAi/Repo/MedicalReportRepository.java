package com.HealthcareManagement.DocAi.Repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.HealthcareManagement.DocAi.Entity.MedicalReport;

@Repository
public interface MedicalReportRepository
        extends JpaRepository<MedicalReport, Long> {

    List<MedicalReport> findByPatientId(Long patientId);

    List<MedicalReport> findByStatus(
            com.HealthcareManagement.DocAi.enums.ReportStatus status);
}