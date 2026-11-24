package com.HealthcareManagement.DocAi.service;

import java.util.List;
import com.HealthcareManagement.DocAi.Entity.Doctor;

public interface DoctorService {

    Doctor saveDoctor(Doctor doctor);

    List<Doctor> getAllDoctors();

    Doctor getDoctorById(Long id);

    Doctor updateDoctor(Long id, Doctor doctor);

    void deleteDoctor(Long id);
}