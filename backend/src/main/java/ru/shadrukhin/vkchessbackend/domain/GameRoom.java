package ru.shadrukhin.vkchessbackend.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "game_rooms")
public class GameRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String fen;

    @Column(nullable = false)
    private String turn;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private GameStatus status;

    private String whitePlayerId;

    private String blackPlayerId;

    private String winnerColor;

    private String finishReason;

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @Column(nullable = false)
    private Boolean whiteOnline = false;

    @Column(nullable = false)
    private Boolean blackOnline = false;
}