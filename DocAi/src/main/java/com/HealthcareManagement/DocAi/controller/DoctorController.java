
package com.HealthcareManagement.DocAi.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.HealthcareManagement.DocAi.Entity.Doctor;
import com.HealthcareManagement.DocAi.Repo.DoctorRepository;
import com.HealthcareManagement.DocAi.security.JwtService;
import com.HealthcareManagement.DocAi.dto.LoginRequest;
import com.HealthcareManagement.DocAi.dto.response.AuthResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "*")
public class DoctorController {

    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public DoctorController(
            DoctorRepository doctorRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.doctorRepository = doctorRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // Doctor Registration
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody Doctor doctor) {

        if (doctorRepository.existsByEmail(doctor.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email already registered"));
        }

        doctor.setId(null);
        doctor.setPassword(
                passwordEncoder.encode(doctor.getPassword()));

        Doctor savedDoctor = doctorRepository.save(doctor);

        String token = jwtService.generateToken(savedDoctor.getEmail());

        return ResponseEntity.ok(
                new AuthResponse(
                        token,
                        savedDoctor.getId(),
                        savedDoctor.getName(),
                        savedDoctor.getEmail(),
                        "DOCTOR"
                )
        );
    }

    // Doctor Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        Doctor doctor = doctorRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        if (doctor == null ||
                !passwordEncoder.matches(
                        request.getPassword(), doctor.getPassword())) {

            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid email or password"));
        }

        String token = jwtService.generateToken(doctor.getEmail());

        return ResponseEntity.ok(
                new AuthResponse(
                        token,
                        doctor.getId(),
                        doctor.getName(),
                        doctor.getEmail(),
                        "DOCTOR"
                )
        );
    }

    // Get Doctor by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getDoctor(@PathVariable Long id) {

        return doctorRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get All Doctors
    @GetMapping
    public ResponseEntity<?> getAllDoctors() {

        return ResponseEntity.ok(doctorRepository.findAll());
    }

    // Delete Doctor
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id) {

        if (!doctorRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        doctorRepository.deleteById(id);

        return ResponseEntity.ok(
                Map.of("message", "Doctor deleted successfully"));
    }
}
