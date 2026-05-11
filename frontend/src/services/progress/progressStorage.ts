import type {
    LearningEvaluationState,
    PlayerLevelGroup,
    ProgressState,
    ResumeTrainingRequest,
    ScenarioProgressRecord,
} from './progressTypes';

import {
    deleteTrainingProgress,
    getLearningEvaluation,
    getTrainingProgress,
    saveLearningEvaluationApi,
    saveTrainingProgress,
} from './trainingProgressApi';
import { getCachedPlayerId } from '../vk/vkUser';


const RESUME_KEY = 'vk_chess_resume_training';

const emptyProgress: ProgressState = {
    scenarios: {},
    evaluation: {},
};


const toProgressState = (records: ScenarioProgressRecord[]): ProgressState => {
    return {
        scenarios: Object.fromEntries(records.map((item) => [item.scenarioId, item])),
    };
};

const getLevelResult = (score: number): { group: PlayerLevelGroup; label: string } => {
    if (score <= 3) {
        return {
            group: 'novice',
            label: 'новичок',
        };
    }

    if (score <= 7) {
        return {
            group: 'intermediate',
            label: 'средний',
        };
    }

    return {
        group: 'confident',
        label: 'уверенный',
    };
};

const calculateEfficiency = (evaluation: LearningEvaluationState): LearningEvaluationState => {
    if (
        evaluation.levelTestPercent === undefined ||
        evaluation.finalTestPercent === undefined
    ) {
        return evaluation;
    }

    const baselineMultiplier = evaluation.levelGroup === 'confident'
        ? 0.7
        : evaluation.levelGroup === 'intermediate'
            ? 0.85
            : 1;

    const efficiencyPercent = Math.round(evaluation.finalTestPercent * baselineMultiplier);
    const efficiencyLabel = efficiencyPercent <= 39
        ? 'низкая'
        : efficiencyPercent <= 69
            ? 'средняя'
            : 'высокая';

    return {
        ...evaluation,
        efficiencyPercent,
        efficiencyLabel,
    };
};

export const loadLearningEvaluation = async (): Promise<LearningEvaluationState> => {
    try {
        const playerId = getCachedPlayerId();
        const dto = await getLearningEvaluation(playerId);

        return calculateEfficiency(dto);
    } catch {
        return {};
    }
};

export const saveLearningEvaluation = async (
    evaluation: LearningEvaluationState,
): Promise<LearningEvaluationState> => {
    const nextEvaluation = calculateEfficiency(evaluation);
    const playerId = getCachedPlayerId();

    const saved = await saveLearningEvaluationApi({
        playerId,
        ...nextEvaluation,
    });

    return calculateEfficiency(saved);
};

export const saveLevelTestResult = async (
    score: number,
    total: number,
): Promise<LearningEvaluationState> => {
    const previousEvaluation = await loadLearningEvaluation();
    const percent = Math.round((score / total) * 100);
    const level = getLevelResult(score);

    return saveLearningEvaluation({
        ...previousEvaluation,
        levelTestScore: score,
        levelTestPercent: percent,
        levelGroup: level.group,
        levelLabel: level.label,
        levelCompletedAt: new Date().toISOString(),
    });
};

export const saveFinalTestResult = async (
    score: number,
    total: number,
    passed: boolean,
): Promise<LearningEvaluationState> => {
    const previousEvaluation = await loadLearningEvaluation();

    return saveLearningEvaluation({
        ...previousEvaluation,
        finalTestScore: score,
        finalTestTotal: total,
        finalTestPercent: Math.round((score / total) * 100),
        finalTestPassed: passed,
        finalTestCompletedAt: new Date().toISOString(),
    });
};

const safeLoadEvaluation = async (): Promise<LearningEvaluationState> => {
    try {
        return await loadLearningEvaluation();
    } catch {
        return {};
    }
};

export const loadProgress = async (): Promise<ProgressState> => {
    try {
        const playerId = getCachedPlayerId();
        const records = await getTrainingProgress(playerId);
        const evaluation = await safeLoadEvaluation();

        return {
            ...toProgressState(records),
            evaluation,
        };
    } catch {
        return {
            ...emptyProgress,
            evaluation: await safeLoadEvaluation(),
        };
    }
};

export const markScenarioStarted = async (
    scenarioId: string,
    scenarioType: 'tactic' | 'opening',
    title: string,
) => {
    const progress = await loadProgress();
    const existing = progress.scenarios[scenarioId];

    const record: Omit<ScenarioProgressRecord, 'lastOpenedAt' | 'completedAt'> = {
        scenarioId,
        scenarioType,
        title,
        status: existing?.status ?? 'started',
        attempts: existing?.attempts ?? 0,
        mistakes: existing?.mistakes ?? 0,
        currentStep: existing?.currentStep ?? 0,
        lastFen: existing?.lastFen,
        completedFen: existing?.completedFen,
    };

    return saveTrainingProgress({
        playerId: getCachedPlayerId(),
        ...record,
    });
};

export const registerScenarioAttempt = async (
    scenarioId: string,
    scenarioType: 'tactic' | 'opening',
    title: string,
    isCorrect: boolean,
) => {
    const progress = await loadProgress();
    const existing = progress.scenarios[scenarioId];

    const record: Omit<ScenarioProgressRecord, 'lastOpenedAt' | 'completedAt'> = {
        scenarioId,
        scenarioType,
        title,
        status: existing?.status ?? 'started',
        attempts: (existing?.attempts ?? 0) + 1,
        mistakes: (existing?.mistakes ?? 0) + (isCorrect ? 0 : 1),
        currentStep: existing?.currentStep ?? 0,
        lastFen: existing?.lastFen,
        completedFen: existing?.completedFen,
    };

    return saveTrainingProgress({
        playerId: getCachedPlayerId(),
        ...record,
    });
};

export const updateScenarioPosition = async (
    scenarioId: string,
    scenarioType: 'tactic' | 'opening',
    title: string,
    currentStep: number,
    lastFen: string,
) => {
    const progress = await loadProgress();
    const existing = progress.scenarios[scenarioId];

    const record: Omit<ScenarioProgressRecord, 'lastOpenedAt' | 'completedAt'> = {
        scenarioId,
        scenarioType,
        title,
        status: existing?.status ?? 'started',
        attempts: existing?.attempts ?? 0,
        mistakes: existing?.mistakes ?? 0,
        currentStep,
        lastFen,
        completedFen: existing?.completedFen,
    };

    return saveTrainingProgress({
        playerId: getCachedPlayerId(),
        ...record,
    });
};

export const markScenarioCompleted = async (
    scenarioId: string,
    scenarioType: 'tactic' | 'opening',
    title: string,
    completedFen?: string,
) => {
    const progress = await loadProgress();
    const existing = progress.scenarios[scenarioId];

    const record: Omit<ScenarioProgressRecord, 'lastOpenedAt' | 'completedAt'> = {
        scenarioId,
        scenarioType,
        title,
        status: 'completed',
        attempts: existing?.attempts ?? 0,
        mistakes: existing?.mistakes ?? 0,
        currentStep: existing?.currentStep,
        lastFen: existing?.lastFen,
        completedFen,
    };

    return saveTrainingProgress({
        playerId: getCachedPlayerId(),
        ...record,
    });
};

export const deleteScenarioProgress = async (scenarioId: string) => {
    await deleteTrainingProgress(getCachedPlayerId(), scenarioId);
};

export const clearProgress = async () => {
    const progress = await loadProgress();

    await Promise.all(
        Object.keys(progress.scenarios).map((scenarioId) =>
            deleteTrainingProgress(getCachedPlayerId(), scenarioId),
        ),
    );
};

export const saveResumeRequest = (request: ResumeTrainingRequest) => {
    localStorage.setItem(RESUME_KEY, JSON.stringify(request));
};

export const consumeResumeRequest = (): ResumeTrainingRequest | null => {
    try {
        const raw = localStorage.getItem(RESUME_KEY);

        if (!raw) {
            return null;
        }

        localStorage.removeItem(RESUME_KEY);

        return JSON.parse(raw) as ResumeTrainingRequest;
    } catch {
        localStorage.removeItem(RESUME_KEY);
        return null;
    }
};
