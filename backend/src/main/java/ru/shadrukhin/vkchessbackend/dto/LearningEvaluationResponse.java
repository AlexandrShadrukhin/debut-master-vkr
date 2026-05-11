package ru.shadrukhin.vkchessbackend.dto;

import java.time.Instant;

public record LearningEvaluationResponse(
        String playerId,
        Integer levelTestScore,
        Integer levelTestPercent,
        String levelGroup,
        String levelLabel,
        Instant levelCompletedAt,
        Integer finalTestScore,
        Integer finalTestTotal,
        Integer finalTestPercent,
        Boolean finalTestPassed,
        Instant finalTestCompletedAt,
        Integer efficiencyPercent,
        String efficiencyLabel,
        Instant updatedAt
) {
}
