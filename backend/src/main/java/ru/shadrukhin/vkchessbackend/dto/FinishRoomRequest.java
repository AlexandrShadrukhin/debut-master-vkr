package ru.shadrukhin.vkchessbackend.dto;

public record FinishRoomRequest(
        String playerId,
        String winnerColor,
        String reason
) {
}