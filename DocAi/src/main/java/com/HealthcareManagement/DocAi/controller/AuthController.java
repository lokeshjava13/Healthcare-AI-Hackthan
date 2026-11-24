package com.HealthcareManagement.DocAi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.HealthcareManagement.DocAi.service.AuthService;

import jakarta.validation.Valid;

import com.HealthcareManagement.DocAi.dto.LoginRequest;
import com.HealthcareManagement.DocAi.dto.RegisterRequest;
import com.HealthcareManagement.DocAi.dto.response.AuthResponse;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}