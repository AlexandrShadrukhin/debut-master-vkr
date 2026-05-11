package ru.shadrukhin.vkchessbackend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.shadrukhin.vkchessbackend.domain.TrainingProgress;
import ru.shadrukhin.vkchessbackend.dto.TrainingProgressRequest;
import ru.shadrukhin.vkchessbackend.dto.TrainingProgressResponse;
import ru.shadrukhin.vkchessbackend.repository.TrainingProgressRepository;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TrainingProgressService {

    private final TrainingProgressRepository repository;

    @Transactional(readOnly = true)
    public List<TrainingProgressResponse> getProgress(String playerId) {
        return repository.findByPlayerIdOrderByLastOpenedAtDesc(playerId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public TrainingProgressResponse saveProgress(TrainingProgressRequest request) {
        TrainingProgress progress = repository
                .findByPlayerIdAndScenarioId(request.playerId(), request.scenarioId())
                .orElseGet(TrainingProgress::new);

        boolean completedNow = "completed".equals(request.status());

        progress.setPlayerId(request.playerId());
        progress.setScenarioId(request.scenarioId());
        progress.setScenarioType(request.scenarioType());
        progress.setTitle(request.title());
        progress.setStatus(request.status());
        progress.setAttempts(request.attempts() == null ? 0 : request.attempts());
        progress.setMistakes(request.mistakes() == null ? 0 : request.mistakes());
        progress.setCurrentStep(request.currentStep());
        progress.setLastFen(request.lastFen());
        progress.setCompletedFen(request.completedFen());
        progress.setLastOpenedAt(Instant.now());

        if (completedNow && progress.getCompletedAt() == null) {
            progress.setCompletedAt(Instant.now());
        }

        return toResponse(repository.save(progress));
    }

    @Transactional
    public void deleteProgress(String playerId, String scenarioId) {
        repository.findByPlayerIdAndScenarioId(playerId, scenarioId)
                .ifPresent(repository::delete);
    }

    private TrainingProgressResponse toResponse(TrainingProgress progress) {
        return new TrainingProgressResponse(
                progress.getPlayerId(),
                progress.getScenarioId(),
                progress.getScenarioType(),
                progress.getTitle(),
                progress.getStatus(),
                progress.getAttempts(),
                progress.getMistakes(),
                progress.getCurrentStep(),
                progress.getLastFen(),
                progress.getCompletedFen(),
                progress.getCompletedAt(),
                progress.getLastOpenedAt()
        );
    }
}