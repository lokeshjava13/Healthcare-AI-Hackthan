package com.HealthcareManagement.DocAi.service;

import java.util.List;
import com.HealthcareManagement.DocAi.Entity.Patient;

public interface PatientService {
    Patient savePatient(Patient patient);
    List<Patient> getAllPatients();
    Patient getPatientById(Long id);
    Patient updatePatient(Long id, Patient patient);
    void deletePatient(Long id);
}