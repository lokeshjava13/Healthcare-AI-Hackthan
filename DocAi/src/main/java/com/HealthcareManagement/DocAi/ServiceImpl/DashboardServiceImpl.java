
package com.HealthcareManagement.DocAi.ServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.HealthcareManagement.DocAi.service.DashboardService;
import com.HealthcareManagement.DocAi.Repo.PatientRepository;
import com.HealthcareManagement.DocAi.Repo.DoctorRepository;
import com.HealthcareManagement.DocAi.Repo.AppointmentRepository;
import com.HealthcareManagement.DocAi.Repo.MedicalReportRepository;
import com.HealthcareManagement.DocAi.dto.response.DashboardResponse;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private MedicalReportRepository medicalReportRepository;

    @Override
    public DashboardResponse getDashboardData() {

        long totalPatients = patientRepository.count();
        long totalDoctors = doctorRepository.count();
        long totalAppointments = appointmentRepository.count();
        long totalMedicalReports = medicalReportRepository.count();

        DashboardResponse response = new DashboardResponse();

        response.setTotalPatients(totalPatients);
        response.setTotalDoctors(totalDoctors);
        response.setTotalAppointments(totalAppointments);
        response.setTotalMedicalReports(totalMedicalReports);

        return response;
    }
}
