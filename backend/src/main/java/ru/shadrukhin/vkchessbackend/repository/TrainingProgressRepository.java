package ru.shadrukhin.vkchessbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.shadrukhin.vkchessbackend.domain.TrainingProgress;

import java.util.List;
import java.util.Optional;

public interface TrainingProgressRepository extends JpaRepository<TrainingProgress, Long> {

    List<TrainingProgress> findByPlayerIdOrderByLastOpenedAtDesc(String playerId);

    Optional<TrainingProgress> findByPlayerIdAndScenarioId(String playerId, String scenarioId);
}