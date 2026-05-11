export type {
    ProgressState,
    LearningEvaluationState,
    PlayerLevelGroup,
    ScenarioProgressRecord,
    ScenarioProgressStatus,
    ResumeTrainingRequest,
} from './progressTypes';

export {
    loadProgress,
    markScenarioStarted,
    registerScenarioAttempt,
    updateScenarioPosition,
    markScenarioCompleted,
    deleteScenarioProgress,
    clearProgress,
    loadLearningEvaluation,
    saveLearningEvaluation,
    saveLevelTestResult,
    saveFinalTestResult,
    saveResumeRequest,
    consumeResumeRequest,
} from './progressStorage';
