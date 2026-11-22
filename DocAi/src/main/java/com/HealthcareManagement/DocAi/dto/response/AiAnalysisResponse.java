package com.HealthcareManagement.DocAi.dto.response;

public class AiAnalysisResponse {

    private String summary;
    private String possibleConditions;
    private String recommendations;
    private String precautions;

    public AiAnalysisResponse() {
    }

    public AiAnalysisResponse(String summary, String possibleConditions,
                              String recommendations, String precautions) {
        this.summary = summary;
        this.possibleConditions = possibleConditions;
        this.recommendations = recommendations;
        this.precautions = precautions;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getPossibleConditions() {
        return possibleConditions;
    }

    public void setPossibleConditions(String possibleConditions) {
        this.possibleConditions = possibleConditions;
    }

    public String getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(String recommendations) {
        this.recommendations = recommendations;
    }

    public String getPrecautions() {
        return precautions;
    }

    public void setPrecautions(String precautions) {
        this.precautions = precautions;
    }
}