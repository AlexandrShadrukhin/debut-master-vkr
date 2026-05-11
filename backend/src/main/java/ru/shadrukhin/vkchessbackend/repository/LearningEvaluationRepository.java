package ru.shadrukhin.vkchessbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.shadrukhin.vkchessbackend.domain.LearningEvaluation;

import java.util.Optional;

public interface LearningEvaluationRepository extends JpaRepository<LearningEvaluation, Long> {

    Optional<LearningEvaluation> findByPlayerId(String playerId);

    void deleteByPlayerId(String playerId);
}
