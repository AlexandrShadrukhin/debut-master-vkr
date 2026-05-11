package ru.shadrukhin.vkchessbackend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.shadrukhin.vkchessbackend.domain.GameMove;
import ru.shadrukhin.vkchessbackend.domain.GameRoom;
import ru.shadrukhin.vkchessbackend.domain.GameStatus;
import ru.shadrukhin.vkchessbackend.dto.MoveRequest;
import ru.shadrukhin.vkchessbackend.dto.RoomResponse;
import ru.shadrukhin.vkchessbackend.repository.GameMoveRepository;
import ru.shadrukhin.vkchessbackend.repository.GameRoomRepository;

import java.security.SecureRandom;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class GameRoomService {

    private static final String INITIAL_FEN =
            "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    private final GameRoomRepository roomRepository;
    private final GameMoveRepository moveRepository;

    private final SecureRandom random = new SecureRandom();

    @Transactional
    public RoomResponse createRoom(String playerId) {
        GameRoom room = new GameRoom();

        room.setCode(generateRoomCode());
        room.setFen(INITIAL_FEN);
        room.setTurn("w");
        room.setStatus(GameStatus.WAITING);
        room.setWhitePlayerId(playerId);
        room.setWhiteOnline(true);
        room.setBlackOnline(false);
        room.setCreatedAt(Instant.now());
        room.setUpdatedAt(Instant.now());

        return toResponse(roomRepository.save(room));
    }

    @Transactional
    public RoomResponse joinRoom(String code, String playerId) {
        GameRoom room = getRoomByCode(code);

        if (room.getBlackPlayerId() == null && !playerId.equals(room.getWhitePlayerId())) {
            room.setBlackPlayerId(playerId);
            room.setStatus(GameStatus.ACTIVE);
            room.setUpdatedAt(Instant.now());
            room.setBlackOnline(true);
        }
        if (playerId.equals(room.getWhitePlayerId())) {
            room.setWhiteOnline(true);
        }

        if (playerId.equals(room.getBlackPlayerId())) {
            room.setBlackOnline(true);
        }

        room.setUpdatedAt(Instant.now());

        return toResponse(room);
    }

    @Transactional(readOnly = true)
    public RoomResponse getRoom(String code) {
        return toResponse(getRoomByCode(code));
    }

    @Transactional
    public RoomResponse applyMove(String code, MoveRequest request) {
        GameRoom room = getRoomByCode(code);

        GameMove move = new GameMove();
        move.setRoom(room);
        move.setPlayerId(request.playerId());
        move.setFromSquare(request.from());
        move.setToSquare(request.to());
        move.setPromotion(request.promotion());
        move.setFenAfter(request.fenAfter());
        move.setCreatedAt(Instant.now());

        moveRepository.save(move);

        room.setFen(request.fenAfter());
        room.setTurn(extractTurn(request.fenAfter()));
        room.setStatus(GameStatus.ACTIVE);
        room.setUpdatedAt(Instant.now());

        return toResponse(room);
    }

    private GameRoom getRoomByCode(String code) {
        return roomRepository.findByCode(code)
                .orElseThrow(() -> new IllegalArgumentException("Room not found: " + code));
    }

    private RoomResponse toResponse(GameRoom room) {
        return new RoomResponse(
                room.getCode(),
                room.getFen(),
                room.getTurn(),
                room.getStatus(),
                room.getWhitePlayerId(),
                room.getBlackPlayerId(),
                room.getWhiteOnline(),
                room.getBlackOnline(),
                room.getWinnerColor(),
                room.getFinishReason()
        );
    }

    private String extractTurn(String fen) {
        String[] parts = fen.split(" ");
        return parts.length > 1 ? parts[1] : "w";
    }

    private String generateRoomCode() {
        String alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

        while (true) {
            StringBuilder code = new StringBuilder();

            for (int i = 0; i < 6; i++) {
                code.append(alphabet.charAt(random.nextInt(alphabet.length())));
            }

            if (roomRepository.findByCode(code.toString()).isEmpty()) {
                return code.toString();
            }
        }
    }

    @Transactional
    public RoomResponse leaveRoom(String code, String playerId) {
        GameRoom room = getRoomByCode(code);

        if (playerId.equals(room.getWhitePlayerId())) {
            room.setWhiteOnline(false);
        }

        if (playerId.equals(room.getBlackPlayerId())) {
            room.setBlackOnline(false);
        }

        room.setUpdatedAt(Instant.now());

        return toResponse(room);
    }

    @Transactional
    public RoomResponse finishRoom(String code, String winnerColor, String reason) {
        GameRoom room = getRoomByCode(code);

        room.setStatus(GameStatus.FINISHED);
        room.setWinnerColor(winnerColor);
        room.setFinishReason(reason);
        room.setUpdatedAt(Instant.now());

        return toResponse(room);
    }

    @Transactional(readOnly = true)
    public java.util.List<RoomResponse> getPlayerRooms(String playerId) {
        return roomRepository
                .findByWhitePlayerIdOrBlackPlayerIdOrderByUpdatedAtDesc(playerId, playerId)
                .stream()
                .map(this::toResponse)
                .toList();
    }
}