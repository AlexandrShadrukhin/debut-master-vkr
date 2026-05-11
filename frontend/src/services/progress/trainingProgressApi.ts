export type TrainingProgressRecordDto = {
    playerId: string;
    scenarioId: string;
    scenarioType: 'tactic' | 'opening';
    title: string;
    status: 'started' | 'completed';
    attempts: number;
    mistakes: number;
    currentStep?: number;
    lastFen?: string;
    completedFen?: string;
    completedAt?: string;
    lastOpenedAt: string;
};

export type LearningEvaluationDto = {
    playerId: string;
    levelTestScore?: number;
    levelTestPercent?: number;
    levelGroup?: 'novice' | 'intermediate' | 'confident';
    levelLabel?: string;
    levelCompletedAt?: string;

    finalTestScore?: number;
    finalTestTotal?: number;
    finalTestPercent?: number;
    finalTestPassed?: boolean;
    finalTestCompletedAt?: string;

    efficiencyPercent?: number;
    efficiencyLabel?: string;
    updatedAt?: string;
};

const API_URL = 'https://vk-chess-backend.onrender.com';

export const getTrainingProgress = async (playerId: string) => {
    const response = await fetch(`${API_URL}/api/training-progress/${playerId}`);

    if (!response.ok) {
        throw new Error('Не удалось получить прогресс обучения');
    }

    return response.json() as Promise<TrainingProgressRecordDto[]>;
};

export const saveTrainingProgress = async (
    record: Omit<TrainingProgressRecordDto, 'lastOpenedAt' | 'completedAt'>,
) => {
    const response = await fetch(`${API_URL}/api/training-progress`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
    });

    if (!response.ok) {
        throw new Error('Не удалось сохранить прогресс обучения');
    }

    return response.json() as Promise<TrainingProgressRecordDto>;
};

export const deleteTrainingProgress = async (
    playerId: string,
    scenarioId: string,
) => {
    const response = await fetch(
        `${API_URL}/api/training-progress/${playerId}/${scenarioId}`,
        {
            method: 'DELETE',
        },
    );

    if (!response.ok) {
        throw new Error('Не удалось удалить прогресс обучения');
    }
};

export const getLearningEvaluation = async (playerId: string) => {
    const response = await fetch(`${API_URL}/api/learning-evaluation/${playerId}`);

    if (!response.ok) {
        throw new Error('Не удалось получить оценку обучения');
    }

    return response.json() as Promise<LearningEvaluationDto>;
};

export const saveLearningEvaluationApi = async (
    record: LearningEvaluationDto,
) => {
    const response = await fetch(`${API_URL}/api/learning-evaluation`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
    });

    if (!response.ok) {
        throw new Error('Не удалось сохранить оценку обучения');
    }

    return response.json() as Promise<LearningEvaluationDto>;
};

export const deleteLearningEvaluation = async (playerId: string) => {
    const response = await fetch(`${API_URL}/api/learning-evaluation/${playerId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Не удалось удалить оценку обучения');
    }
};
