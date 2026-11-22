package com.HealthcareManagement.DocAi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.HealthcareManagement.DocAi.Entity.MedicalHistory;
import com.HealthcareManagement.DocAi.service.MedicalHistoryService;

@RestController
@RequestMapping("/api/medical-history")
@CrossOrigin(origins = "*")
public class MedicalHistoryController {

    @Autowired
    private MedicalHistoryService medicalHistoryService;

    @PostMapping
    public ResponseEntity<MedicalHistory> saveMedicalHistory(
            @RequestBody MedicalHistory history) {
        return ResponseEntity.ok(
                medicalHistoryService.saveMedicalHistory(history));
    }

    @GetMapping
    public ResponseEntity<List<MedicalHistory>> getAllMedicalHistories() {
        return ResponseEntity.ok(
                medicalHistoryService.getAllMedicalHistories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalHistory> getMedicalHistoryById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                medicalHistoryService.getMedicalHistoryById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicalHistory> updateMedicalHistory(
            @PathVariable Long id,
            @RequestBody MedicalHistory history) {
        return ResponseEntity.ok(
                medicalHistoryService.updateMedicalHistory(id, history));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMedicalHistory(
            @PathVariable Long id) {
        medicalHistoryService.deleteMedicalHistory(id);
        return ResponseEntity.ok("Medical history deleted successfully");
    }
}