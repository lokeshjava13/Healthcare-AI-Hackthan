package com.HealthcareManagement.DocAi.Repo;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.HealthcareManagement.DocAi.Entity.Appointment;
import com.HealthcareManagement.DocAi.enums.AppointmentStatus;

@Repository
public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientId(Long patientId);

    List<Appointment> findByDoctorId(Long doctorId);

    List<Appointment> findByAppointmentDate(LocalDate appointmentDate);

    List<Appointment> findByStatus(AppointmentStatus status);
}