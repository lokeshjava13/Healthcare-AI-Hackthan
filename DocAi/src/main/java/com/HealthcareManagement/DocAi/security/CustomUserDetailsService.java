
package com.HealthcareManagement.DocAi.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.HealthcareManagement.DocAi.Entity.Patient;
import com.HealthcareManagement.DocAi.Entity.Doctor;
import com.HealthcareManagement.DocAi.Repo.PatientRepository;
import com.HealthcareManagement.DocAi.Repo.DoctorRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public CustomUserDetailsService(
            PatientRepository patientRepository,
            DoctorRepository doctorRepository) {

        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        Patient patient = patientRepository.findByEmail(email)
                .orElse(null);

        if (patient != null) {
            return org.springframework.security.core.userdetails.User
                    .withUsername(patient.getEmail())
                    .password(patient.getPassword())
                    .roles("PATIENT")
                    .build();
        }

        Doctor doctor = doctorRepository.findByEmail(email)
                .orElse(null);

        if (doctor != null) {
            return org.springframework.security.core.userdetails.User
                    .withUsername(doctor.getEmail())
                    .password(doctor.getPassword())
                    .roles("DOCTOR")
                    .build();
        }

        throw new UsernameNotFoundException("Account not found: " + email);
    }
}
