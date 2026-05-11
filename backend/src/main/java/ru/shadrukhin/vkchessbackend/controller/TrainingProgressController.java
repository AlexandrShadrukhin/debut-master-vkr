package ru.shadrukhin.vkchessbackend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ru.shadrukhin.vkchessbackend.dto.TrainingProgressRequest;
import ru.shadrukhin.vkchessbackend.dto.TrainingProgressResponse;
import ru.shadrukhin.vkchessbackend.service.TrainingProgressService;

import java.util.List;

@RestController
@RequestMapping("/api/training-progress")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TrainingProgressController {

    private final TrainingProgressService service;

    @GetMapping("/{playerId}")
    public List<TrainingProgressResponse> getProgress(@PathVariable String playerId) {
        return service.getProgress(playerId);
    }

    @PostMapping
    public TrainingProgressResponse saveProgress(@RequestBody TrainingProgressRequest request) {
        return service.saveProgress(request);
    }

    @DeleteMapping("/{playerId}/{scenarioId}")
    public void deleteProgress(
            @PathVariable String playerId,
            @PathVariable String scenarioId
    ) {
        service.deleteProgress(playerId, scenarioId);
    }
}