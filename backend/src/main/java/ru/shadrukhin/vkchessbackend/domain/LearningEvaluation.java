package ru.shadrukhin.vkchessbackend.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(
        name = "learning_evaluation",
        uniqueConstraints = @UniqueConstraint(columnNames = "player_id")
)
public class LearningEvaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "player_id", nullable = false, unique = true)
    private String playerId;

    private Integer levelTestScore;

    private Integer levelTestPercent;

    private String levelGroup;

    private String levelLabel;

    private Instant levelCompletedAt;

    private Integer finalTestScore;

    private Integer finalTestTotal;

    private Integer finalTestPercent;

    private Boolean finalTestPassed;

    private Instant finalTestCompletedAt;

    private Integer efficiencyPercent;

    private String efficiencyLabel;

    private Instant updatedAt;
}
