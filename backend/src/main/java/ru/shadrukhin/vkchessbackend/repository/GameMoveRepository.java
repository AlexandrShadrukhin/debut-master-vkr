package ru.shadrukhin.vkchessbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.shadrukhin.vkchessbackend.domain.GameMove;
import ru.shadrukhin.vkchessbackend.domain.GameRoom;

import java.util.List;

public interface GameMoveRepository extends JpaRepository<GameMove, Long> {
    List<GameMove> findByRoomOrderByCreatedAtAsc(GameRoom room);
}