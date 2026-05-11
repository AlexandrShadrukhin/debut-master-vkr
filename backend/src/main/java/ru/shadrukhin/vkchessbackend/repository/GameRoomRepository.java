package ru.shadrukhin.vkchessbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.shadrukhin.vkchessbackend.domain.GameRoom;

import java.util.List;
import java.util.Optional;

public interface GameRoomRepository extends JpaRepository<GameRoom, Long> {
    Optional<GameRoom> findByCode(String code);

    List<GameRoom> findByWhitePlayerIdOrBlackPlayerIdOrderByUpdatedAtDesc(
            String whitePlayerId,
            String blackPlayerId
    );
}