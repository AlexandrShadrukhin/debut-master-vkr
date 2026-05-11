package ru.shadrukhin.vkchessbackend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import ru.shadrukhin.vkchessbackend.dto.CreateRoomRequest;
import ru.shadrukhin.vkchessbackend.dto.JoinRoomRequest;
import ru.shadrukhin.vkchessbackend.dto.RoomResponse;
import ru.shadrukhin.vkchessbackend.service.GameRoomService;
import ru.shadrukhin.vkchessbackend.dto.LeaveRoomRequest;
import ru.shadrukhin.vkchessbackend.dto.FinishRoomRequest;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GameRoomController {

    private final GameRoomService gameRoomService;
    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping
    public RoomResponse createRoom(@RequestBody CreateRoomRequest request) {
        return gameRoomService.createRoom(request.playerId());
    }

    @GetMapping("/{code}")
    public RoomResponse getRoom(@PathVariable String code) {
        return gameRoomService.getRoom(code);
    }

    @PostMapping("/{code}/join")
    public RoomResponse joinRoom(
            @PathVariable String code,
            @RequestBody JoinRoomRequest request
    ) {
        RoomResponse response = gameRoomService.joinRoom(code, request.playerId());

        messagingTemplate.convertAndSend("/topic/rooms/" + code, response);

        return response;
    }

    @PostMapping("/{code}/leave")
    public RoomResponse leaveRoom(
            @PathVariable String code,
            @RequestBody LeaveRoomRequest request
    ) {
        RoomResponse response = gameRoomService.leaveRoom(code, request.playerId());

        messagingTemplate.convertAndSend("/topic/rooms/" + code, response);

        return response;
    }

    @PostMapping("/{code}/finish")
    public RoomResponse finishRoom(
            @PathVariable String code,
            @RequestBody FinishRoomRequest request
    ) {
        RoomResponse response = gameRoomService.finishRoom(
                code,
                request.winnerColor(),
                request.reason()
        );

        messagingTemplate.convertAndSend("/topic/rooms/" + code, response);

        return response;
    }

    @GetMapping("/player/{playerId}")
    public List<RoomResponse> getPlayerRooms(@PathVariable String playerId) {
        return gameRoomService.getPlayerRooms(playerId);
    }
}