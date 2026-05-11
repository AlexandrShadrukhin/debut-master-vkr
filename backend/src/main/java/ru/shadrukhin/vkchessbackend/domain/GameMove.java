package ru.shadrukhin.vkchessbackend.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "game_moves")
public class GameMove {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private GameRoom room;

    @Column(nullable = false)
    private String playerId;

    @Column(nullable = false)
    private String fromSquare;

    @Column(nullable = false)
    private String toSquare;

    private String promotion;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String fenAfter;

    @Column(nullable = false)
    private Instant createdAt;
}