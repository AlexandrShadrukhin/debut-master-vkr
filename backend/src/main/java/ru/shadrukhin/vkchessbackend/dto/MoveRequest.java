package ru.shadrukhin.vkchessbackend.dto;

public record MoveRequest(
        String playerId,
        String from,
        String to,
        String promotion,
        String fenAfter
) {
}