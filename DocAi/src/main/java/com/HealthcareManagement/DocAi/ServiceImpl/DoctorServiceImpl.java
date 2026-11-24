
package com.HealthcareManagement.DocAi.ServiceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.HealthcareManagement.DocAi.Entity.Doctor;
import com.HealthcareManagement.DocAi.Repo.DoctorRepository;
import com.HealthcareManagement.DocAi.service.DoctorService;
import com.HealthcareManagement.DocAi.Exception.ResourceNotFoundException;

@Service
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Override
    public Doctor saveDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    @Override
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @Override
    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Doctor not found with id: " + id));
    }

    @Override
    public Doctor updateDoctor(Long id, Doctor doctor) {
        Doctor existingDoctor = getDoctorById(id);

        existingDoctor.setSpecialization(doctor.getSpecialization());
        existingDoctor.setQualification(doctor.getQualification());
        existingDoctor.setExperience(doctor.getExperience());
        existingDoctor.setConsultationFee(doctor.getConsultationFee());
        existingDoctor.setHospitalName(doctor.getHospitalName());
        existingDoctor.setAvailability(doctor.getAvailability());

        return doctorRepository.save(existingDoctor);
    }

    @Override
    public void deleteDoctor(Long id) {
        Doctor doctor = getDoctorById(id);
        doctorRepository.delete(doctor);
    }
}
