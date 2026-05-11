package ru.shadrukhin.vkchessbackend.dto;

import java.time.Instant;

public record TrainingProgressResponse(
        String playerId,
        String scenarioId,
        String scenarioType,
        String title,
        String status,
        Integer attempts,
        Integer mistakes,
        Integer currentStep,
        String lastFen,
        String completedFen,
        Instant completedAt,
        Instant lastOpenedAt
) {
}