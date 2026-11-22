
package com.HealthcareManagement.DocAi.ServiceImpl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.HealthcareManagement.DocAi.Entity.Patient;
import com.HealthcareManagement.DocAi.Repo.PatientRepository;
import com.HealthcareManagement.DocAi.security.JwtService;
import com.HealthcareManagement.DocAi.service.AuthService;
import com.HealthcareManagement.DocAi.dto.LoginRequest;
import com.HealthcareManagement.DocAi.dto.RegisterRequest;
import com.HealthcareManagement.DocAi.dto.response.AuthResponse;

@Service
public class AuthServiceImpl implements AuthService {

    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthServiceImpl(
            PatientRepository patientRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (patientRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        Patient patient = new Patient();

        patient.setName(request.getName());
        patient.setEmail(request.getEmail());
        patient.setPassword(passwordEncoder.encode(request.getPassword()));
        patient.setPhone(request.getPhone());

        Patient savedPatient = patientRepository.save(patient);

        String token = jwtService.generateToken(savedPatient.getEmail());

        return new AuthResponse(
                token,
                savedPatient.getId(),
                savedPatient.getName(),
                savedPatient.getEmail(),
                "PATIENT"
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        Patient patient = patientRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(
                request.getPassword(), patient.getPassword())) {

            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(patient.getEmail());

        return new AuthResponse(
                token,
                patient.getId(),
                patient.getName(),
                patient.getEmail(),
                "PATIENT"
        );
    }
}
