package com.HealthcareManagement.DocAi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.HealthcareManagement.DocAi.Entity.MedicalReport;
import com.HealthcareManagement.DocAi.service.MedicalReportService;

@RestController
@RequestMapping("/api/medical-reports")
@CrossOrigin(origins = "*")
public class MedicalReportController {

    @Autowired
    private MedicalReportService medicalReportService;

    @PostMapping
    public ResponseEntity<MedicalReport> saveMedicalReport(
            @RequestBody MedicalReport report) {
        return ResponseEntity.ok(
                medicalReportService.saveMedicalReport(report));
    }

    @GetMapping
    public ResponseEntity<List<MedicalReport>> getAllMedicalReports() {
        return ResponseEntity.ok(
                medicalReportService.getAllMedicalReports());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalReport> getMedicalReportById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                medicalReportService.getMedicalReportById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicalReport> updateMedicalReport(
            @PathVariable Long id,
            @RequestBody MedicalReport report) {
        return ResponseEntity.ok(
                medicalReportService.updateMedicalReport(id, report));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMedicalReport(
            @PathVariable Long id) {
        medicalReportService.deleteMedicalReport(id);
        return ResponseEntity.ok("Medical report deleted successfully");
    }
}