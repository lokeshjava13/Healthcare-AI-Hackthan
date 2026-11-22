
package com.HealthcareManagement.DocAi.service;

import com.HealthcareManagement.DocAi.dto.LoginRequest;
import com.HealthcareManagement.DocAi.dto.RegisterRequest;
import com.HealthcareManagement.DocAi.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
