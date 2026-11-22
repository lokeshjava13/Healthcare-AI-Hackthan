
package com.HealthcareManagement.DocAi.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.HealthcareManagement.DocAi.Entity.Patient;
import com.HealthcareManagement.DocAi.Repo.PatientRepository;
import com.HealthcareManagement.DocAi.security.JwtService;
import com.HealthcareManagement.DocAi.dto.LoginRequest;
import com.HealthcareManagement.DocAi.dto.response.AuthResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*")
public class PatientController {

    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public PatientController(
            PatientRepository patientRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // Patient Registration
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody Patient patient) {

        if (patientRepository.existsByEmail(patient.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email already registered"));
        }

        patient.setId(null);
        patient.setPassword(
                passwordEncoder.encode(patient.getPassword()));

        Patient savedPatient = patientRepository.save(patient);

        String token = jwtService.generateToken(savedPatient.getEmail());

        return ResponseEntity.ok(
                new AuthResponse(
                        token,
                        savedPatient.getId(),
                        savedPatient.getName(),
                        savedPatient.getEmail(),
                        "PATIENT"
                )
        );
    }

    // Patient Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        Patient patient = patientRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        if (patient == null ||
                !passwordEncoder.matches(
                        request.getPassword(), patient.getPassword())) {

            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid email or password"));
        }

        String token = jwtService.generateToken(patient.getEmail());

        return ResponseEntity.ok(
                new AuthResponse(
                        token,
                        patient.getId(),
                        patient.getName(),
                        patient.getEmail(),
                        "PATIENT"
                )
        );
    }

    // Get Patient by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getPatient(@PathVariable Long id) {

        return patientRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get All Patients
    @GetMapping
    public ResponseEntity<?> getAllPatients() {

        return ResponseEntity.ok(patientRepository.findAll());
    }

    // Delete Patient
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePatient(@PathVariable Long id) {

        if (!patientRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        patientRepository.deleteById(id);

        return ResponseEntity.ok(
                Map.of("message", "Patient deleted successfully"));
    }
}
