package ru.shadrukhin.vkchessbackend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.shadrukhin.vkchessbackend.domain.LearningEvaluation;
import ru.shadrukhin.vkchessbackend.dto.LearningEvaluationRequest;
import ru.shadrukhin.vkchessbackend.dto.LearningEvaluationResponse;
import ru.shadrukhin.vkchessbackend.repository.LearningEvaluationRepository;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class LearningEvaluationService {

    private final LearningEvaluationRepository repository;

    @Transactional(readOnly = true)
    public LearningEvaluationResponse getEvaluation(String playerId) {
        return repository.findByPlayerId(playerId)
                .map(this::toResponse)
                .orElseGet(() -> emptyResponse(playerId));
    }

    @Transactional
    public LearningEvaluationResponse saveEvaluation(LearningEvaluationRequest request) {
        LearningEvaluation evaluation = repository
                .findByPlayerId(request.playerId())
                .orElseGet(LearningEvaluation::new);

        Instant now = Instant.now();

        evaluation.setPlayerId(request.playerId());

        if (request.levelTestScore() != null) {
            evaluation.setLevelTestScore(request.levelTestScore());
        }
        if (request.levelTestPercent() != null) {
            evaluation.setLevelTestPercent(request.levelTestPercent());
        }
        if (request.levelGroup() != null) {
            evaluation.setLevelGroup(request.levelGroup());
        }
        if (request.levelLabel() != null) {
            evaluation.setLevelLabel(request.levelLabel());
        }
        if (hasLevelData(request)) {
            evaluation.setLevelCompletedAt(now);
        }

        if (request.finalTestScore() != null) {
            evaluation.setFinalTestScore(request.finalTestScore());
        }
        if (request.finalTestTotal() != null) {
            evaluation.setFinalTestTotal(request.finalTestTotal());
        }
        if (request.finalTestPercent() != null) {
            evaluation.setFinalTestPercent(request.finalTestPercent());
        }
        if (request.finalTestPassed() != null) {
            evaluation.setFinalTestPassed(request.finalTestPassed());
        }
        if (hasFinalData(request)) {
            evaluation.setFinalTestCompletedAt(now);
        }

        if (request.efficiencyPercent() != null) {
            evaluation.setEfficiencyPercent(request.efficiencyPercent());
        }
        if (request.efficiencyLabel() != null) {
            evaluation.setEfficiencyLabel(request.efficiencyLabel());
        }

        evaluation.setUpdatedAt(now);

        return toResponse(repository.save(evaluation));
    }

    @Transactional
    public void deleteEvaluation(String playerId) {
        repository.deleteByPlayerId(playerId);
    }

    private boolean hasLevelData(LearningEvaluationRequest request) {
        return request.levelTestScore() != null
                || request.levelTestPercent() != null
                || request.levelGroup() != null
                || request.levelLabel() != null;
    }

    private boolean hasFinalData(LearningEvaluationRequest request) {
        return request.finalTestScore() != null
                || request.finalTestTotal() != null
                || request.finalTestPercent() != null
                || request.finalTestPassed() != null;
    }

    private LearningEvaluationResponse emptyResponse(String playerId) {
        return new LearningEvaluationResponse(
                playerId,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null
        );
    }

    private LearningEvaluationResponse toResponse(LearningEvaluation evaluation) {
        return new LearningEvaluationResponse(
                evaluation.getPlayerId(),
                evaluation.getLevelTestScore(),
                evaluation.getLevelTestPercent(),
                evaluation.getLevelGroup(),
                evaluation.getLevelLabel(),
                evaluation.getLevelCompletedAt(),
                evaluation.getFinalTestScore(),
                evaluation.getFinalTestTotal(),
                evaluation.getFinalTestPercent(),
                evaluation.getFinalTestPassed(),
                evaluation.getFinalTestCompletedAt(),
                evaluation.getEfficiencyPercent(),
                evaluation.getEfficiencyLabel(),
                evaluation.getUpdatedAt()
        );
    }
}
