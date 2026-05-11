package ru.shadrukhin.vkchessbackend.dto;

import ru.shadrukhin.vkchessbackend.domain.GameStatus;

public record RoomResponse(
        String code,
        String fen,
        String turn,
        GameStatus status,
        String whitePlayerId,
        String blackPlayerId,
        Boolean whiteOnline,
        Boolean blackOnline,
        String winnerColor,
        String finishReason
) {
}