
package com.HealthcareManagement.DocAi.ServiceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.HealthcareManagement.DocAi.Entity.Patient;
import com.HealthcareManagement.DocAi.Repo.PatientRepository;
import com.HealthcareManagement.DocAi.Exception.ResourceNotFoundException;
import com.HealthcareManagement.DocAi.service.PatientService;

@Service
public class PatientServiceImpl implements PatientService {

    @Autowired
    private PatientRepository patientRepository;

   

    @Override
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @Override
    public Patient getPatientById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Patient not found with id: " + id));
    }

    @Override
    public Patient updatePatient(Long id, Patient patient) {

        Patient existing = getPatientById(id);

        existing.setDateOfBirth(patient.getDateOfBirth());
        existing.setGender(patient.getGender());
        existing.setBloodGroup(patient.getBloodGroup());
        existing.setAddress(patient.getAddress());

        return patientRepository.save(existing);
    }

    @Override
    public void deletePatient(Long id) {
        Patient patient = getPatientById(id);
        patientRepository.delete(patient);
    }

	public Patient savePatient(Patient patient) {
		// TODO Auto-generated method stub
		return patientRepository.save(patient);
	}
}
