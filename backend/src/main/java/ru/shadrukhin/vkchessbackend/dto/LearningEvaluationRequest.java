package ru.shadrukhin.vkchessbackend.dto;

public record LearningEvaluationRequest(
        String playerId,
        Integer levelTestScore,
        Integer levelTestPercent,
        String levelGroup,
        String levelLabel,
        Integer finalTestScore,
        Integer finalTestTotal,
        Integer finalTestPercent,
        Boolean finalTestPassed,
        Integer efficiencyPercent,
        String efficiencyLabel
) {
}
