package com.HealthcareManagement.DocAi.Repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.HealthcareManagement.DocAi.Entity.MedicalHistory;

@Repository
public interface MedicalHistoryRepository
        extends JpaRepository<MedicalHistory, Long> {

    List<MedicalHistory> findByPatientId(Long patientId);
}