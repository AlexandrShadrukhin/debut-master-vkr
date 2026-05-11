package ru.shadrukhin.vkchessbackend.dto;

public record TrainingProgressRequest(
        String playerId,
        String scenarioId,
        String scenarioType,
        String title,
        String status,
        Integer attempts,
        Integer mistakes,
        Integer currentStep,
        String lastFen,
        String completedFen
) {
}