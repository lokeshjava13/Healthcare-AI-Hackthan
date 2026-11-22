
package com.HealthcareManagement.DocAi.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "patients")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Patient account details
    @NotBlank
    private String name;

    @Email
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    private String password;

    private String phone;

    // Patient medical details
    private LocalDate dateOfBirth;

    private String gender;

    private String bloodGroup;

    private String address;

    private String emergencyContact;

    private LocalDateTime registeredAt;

    // One Patient can have many Appointments
    @OneToMany(mappedBy = "patient")
    private List<Appointment> appointments;

    // One Patient can have many Medical History records
    @OneToMany(mappedBy = "patient")
    private List<MedicalHistory> medicalHistories;

    // One Patient can have many Medical Reports
    @OneToMany(mappedBy = "patient")
    private List<MedicalReport> medicalReports;

    public Patient() {}

    @PrePersist
    protected void onCreate() {
        registeredAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }

    public LocalDateTime getRegisteredAt() { return registeredAt; }
    public void setRegisteredAt(LocalDateTime registeredAt) { this.registeredAt = registeredAt; }

    public List<Appointment> getAppointments() { return appointments; }
    public void setAppointments(List<Appointment> appointments) { this.appointments = appointments; }

    public List<MedicalHistory> getMedicalHistories() { return medicalHistories; }
    public void setMedicalHistories(List<MedicalHistory> medicalHistories) { this.medicalHistories = medicalHistories; }

    public List<MedicalReport> getMedicalReports() { return medicalReports; }
    public void setMedicalReports(List<MedicalReport> medicalReports) { this.medicalReports = medicalReports; }
}
