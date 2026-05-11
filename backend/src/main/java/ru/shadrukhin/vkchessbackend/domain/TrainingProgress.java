package ru.shadrukhin.vkchessbackend.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(
        name = "training_progress",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"player_id", "scenario_id"})
        }
)
public class TrainingProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "player_id", nullable = false)
    private String playerId;

    @Column(name = "scenario_id", nullable = false)
    private String scenarioId;

    @Column(nullable = false)
    private String scenarioType;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private Integer attempts = 0;

    @Column(nullable = false)
    private Integer mistakes = 0;

    private Integer currentStep;

    @Column(columnDefinition = "TEXT")
    private String lastFen;

    @Column(columnDefinition = "TEXT")
    private String completedFen;

    private Instant completedAt;

    @Column(nullable = false)
    private Instant lastOpenedAt;
}