package ru.shadrukhin.vkchessbackend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ru.shadrukhin.vkchessbackend.dto.LearningEvaluationRequest;
import ru.shadrukhin.vkchessbackend.dto.LearningEvaluationResponse;
import ru.shadrukhin.vkchessbackend.service.LearningEvaluationService;

@RestController
@RequestMapping("/api/learning-evaluation")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LearningEvaluationController {

    private final LearningEvaluationService service;

    @GetMapping("/{playerId}")
    public LearningEvaluationResponse getEvaluation(@PathVariable String playerId) {
        return service.getEvaluation(playerId);
    }

    @PostMapping
    public LearningEvaluationResponse saveEvaluation(@RequestBody LearningEvaluationRequest request) {
        return service.saveEvaluation(request);
    }

    @DeleteMapping("/{playerId}")
    public void deleteEvaluation(@PathVariable String playerId) {
        service.deleteEvaluation(playerId);
    }
}
