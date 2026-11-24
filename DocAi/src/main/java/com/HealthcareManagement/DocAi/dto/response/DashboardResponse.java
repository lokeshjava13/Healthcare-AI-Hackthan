package com.HealthcareManagement.DocAi.dto.response;

public class DashboardResponse {

    private long totalPatients;
    private long totalDoctors;
    private long totalAppointments;
    private long totalMedicalReports;

    public DashboardResponse() {
    }

    public DashboardResponse(long totalPatients, long totalDoctors,
                             long totalAppointments, long totalMedicalReports) {
        this.totalPatients = totalPatients;
        this.totalDoctors = totalDoctors;
        this.totalAppointments = totalAppointments;
        this.totalMedicalReports = totalMedicalReports;
    }

    public long getTotalPatients() {
        return totalPatients;
    }

    public void setTotalPatients(long totalPatients) {
        this.totalPatients = totalPatients;
    }

    public long getTotalDoctors() {
        return totalDoctors;
    }

    public void setTotalDoctors(long totalDoctors) {
        this.totalDoctors = totalDoctors;
    }

    public long getTotalAppointments() {
        return totalAppointments;
    }

    public void setTotalAppointments(long totalAppointments) {
        this.totalAppointments = totalAppointments;
    }

    public long getTotalMedicalReports() {
        return totalMedicalReports;
    }

    public void setTotalMedicalReports(long totalMedicalReports) {
        this.totalMedicalReports = totalMedicalReports;
    }
}