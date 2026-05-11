package ru.shadrukhin.vkchessbackend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import ru.shadrukhin.vkchessbackend.dto.MoveRequest;
import ru.shadrukhin.vkchessbackend.dto.RoomResponse;
import ru.shadrukhin.vkchessbackend.service.GameRoomService;

@Controller
@RequiredArgsConstructor
public class GameSocketController {

    private final GameRoomService gameRoomService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/rooms/{code}/move")
    public void move(
            @DestinationVariable String code,
            MoveRequest request
    ) {
        RoomResponse response = gameRoomService.applyMove(code, request);
        messagingTemplate.convertAndSend("/topic/rooms/" + code, response);
    }
}