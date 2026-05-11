export type ScenarioProgressStatus = 'started' | 'completed';

export type ScenarioProgressRecord = {
    scenarioId: string;
    scenarioType: 'tactic' | 'opening';
    title: string;
    status: ScenarioProgressStatus;
    attempts: number;
    mistakes: number;
    currentStep?: number;
    lastFen?: string;
    completedFen?: string;
    completedAt?: string;
    lastOpenedAt: string;
};

export type PlayerLevelGroup = 'novice' | 'intermediate' | 'confident';

export type LearningEvaluationState = {
    levelTestScore?: number;
    levelTestPercent?: number;
    levelGroup?: PlayerLevelGroup;
    levelLabel?: string;
    levelCompletedAt?: string;

    finalTestScore?: number;
    finalTestTotal?: number;
    finalTestPercent?: number;
    finalTestPassed?: boolean;
    finalTestCompletedAt?: string;

    efficiencyPercent?: number;
    efficiencyLabel?: string;
};

export type ProgressState = {
    scenarios: Record<string, ScenarioProgressRecord>;
    evaluation?: LearningEvaluationState;
};

export type ResumeTrainingRequest = {
    scenarioId: string;
    scenarioType: 'tactic' | 'opening';
    step?: number;
};
