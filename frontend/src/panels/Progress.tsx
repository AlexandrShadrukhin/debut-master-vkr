import { useEffect, useState } from 'react';
import { Button, Card, Group, Panel, PanelHeader, Text, Title } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import {
    deleteScenarioProgress,
    loadProgress,
    saveResumeRequest,
} from '../services/progress';
import type { ProgressState, ScenarioProgressRecord } from '../services/progress';
import { ChessBoard } from '../components/ChessBoard';
import { tacticScenarios } from '../data/training';


const progressCardStyle = {
    padding: 24,
    borderRadius: 20,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.04)',
    boxSizing: 'border-box',
} as const;

export type ProgressProps = {
    id: string;
};

export const Progress = ({ id }: ProgressProps) => {
    const routeNavigator = useRouteNavigator();

    const [refreshKey, setRefreshKey] = useState(0);
    const [previewScenarioId, setPreviewScenarioId] = useState<string | null>(null);

    const [progress, setProgress] = useState<ProgressState>({
        scenarios: {},
    });

    useEffect(() => {
        const load = async () => {
            const data = await loadProgress();
            setProgress(data);
        };

        void load();
    }, [refreshKey]);

    const records = Object.values(progress.scenarios) as ScenarioProgressRecord[];

    const completed = records.filter((item) => item.status === 'completed');
    const openings = records.filter((item) => item.scenarioType === 'opening');
    const tactics = records.filter((item) => item.scenarioType === 'tactic');

    const totalAttempts = records.reduce((sum, item) => sum + item.attempts, 0);
    const totalMistakes = records.reduce((sum, item) => sum + item.mistakes, 0);

    const previewRecord = records.find((item) => item.scenarioId === previewScenarioId);

    const previewTactic = previewRecord?.scenarioType === 'tactic'
        ? tacticScenarios.find((item) => item.id === previewRecord.scenarioId)
        : undefined;

    const previewFen =
        previewRecord?.completedFen ??
        previewRecord?.lastFen ??
        previewTactic?.fen;

    const handleRefresh = () => {
        setRefreshKey((prev) => prev + 1);
    };

    const handleOpenScenario = (
        scenarioId: string,
        scenarioType: 'tactic' | 'opening',
        step?: number,
    ) => {
        saveResumeRequest({
            scenarioId,
            scenarioType,
            step,
        });

        routeNavigator.push('/learning');
    };

    const handleDelete = async (scenarioId: string) => {
        await deleteScenarioProgress(scenarioId);
        setPreviewScenarioId(null);
        handleRefresh();
    };

    const handleBack = () => {
        if (previewScenarioId) {
            setPreviewScenarioId(null);
            return;
        }

        routeNavigator.back();
    };

    return (
        <Panel id={id}>
            <PanelHeader>Прогресс</PanelHeader>

            <div
                style={{
                    paddingBottom: 160,
                    maxWidth: 980,
                    margin: '0 auto',
                    width: '100%',
                }}
            >
                <Group>
                    <div
                        style={{
                            padding: 16,
                            display: 'flex',
                            gap: 12,
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                        }}
                    >
                        <Button onClick={handleBack}>
                            Назад
                        </Button>

                        <Button mode="secondary" onClick={() => routeNavigator.push('/')}>
                            Главная
                        </Button>

                        {!previewScenarioId && (
                            <Button mode="tertiary" onClick={handleRefresh}>
                                Обновить
                            </Button>
                        )}
                    </div>
                </Group>

                <div
                    style={{
                        padding: 24,
                        width: '100%',
                        height: 540,
                        borderRadius: 16,
                        border: '1px solid rgba(255,255,255,0.12)',
                        background: 'rgba(255,255,255,0.04)',
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            height: '100%',
                            overflowY: 'auto',
                            paddingRight: 8,
                            paddingTop: 12,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12,
                            boxSizing: 'border-box',
                        }}
                    >
                        {previewRecord && previewFen ? (
                            <>
                                <Group>
                                    <div style={{padding: 16, textAlign: 'center'}}>
                                        <Title level="2" weight="2" style={{marginBottom: 12}}>
                                            Позиция сценария
                                        </Title>

                                        <Text style={{marginBottom: 12}}>
                                            <b>{previewRecord.title}</b>
                                        </Text>

                                        <Text style={{marginBottom: 12}}>
                                            {previewRecord.status === 'completed'
                                                ? 'Итоговая позиция завершённого сценария.'
                                                : 'Последняя сохранённая позиция. Можно продолжить прохождение с этого места.'}
                                        </Text>
                                    </div>
                                </Group>

                                <ChessBoard
                                    initialFen={previewFen}
                                    title={previewRecord.title}
                                    description={
                                        previewRecord.status === 'completed'
                                            ? 'Итоговая позиция завершённого сценария'
                                            : 'Последняя сохранённая позиция'
                                    }
                                    readOnly
                                />

                                {previewRecord.status !== 'completed' && (
                                    <Group>
                                        <div style={{padding: 16, textAlign: 'center'}}>
                                            <Button
                                                stretched
                                                size="l"
                                                onClick={() =>
                                                    handleOpenScenario(
                                                        previewRecord.scenarioId,
                                                        previewRecord.scenarioType,
                                                        previewRecord.currentStep ?? 0,
                                                    )
                                                }
                                            >
                                                Продолжить с этого места
                                            </Button>
                                        </div>
                                    </Group>
                                )}
                            </>
                        ) : (
                            <>
                                <div style={progressCardStyle}>
                                    <Title level="2" weight="2" style={{ marginBottom: 16 }}>
                                        Панель прогресса
                                    </Title>

                                    <Text style={{ marginBottom: 12 }}>
                                        <b>Завершено сценариев:</b> {completed.length} / {records.length}
                                    </Text>

                                    <Text style={{ marginBottom: 12 }}>
                                        <b>Дебютов в истории:</b> {openings.length}
                                    </Text>

                                    <Text style={{ marginBottom: 12 }}>
                                        <b>Тактических задач в истории:</b> {tactics.length}
                                    </Text>

                                    <Text style={{ marginBottom: 12 }}>
                                        <b>Всего попыток:</b> {totalAttempts}
                                    </Text>

                                    <Text style={{ marginBottom: 12 }}>
                                        <b>Ошибок:</b> {totalMistakes}
                                    </Text>

                                    <Title level="3" weight="2" style={{ marginBottom: 12, marginTop: 20 }}>
                                        Оценка эффективности обучения
                                    </Title>

                                    {progress.evaluation?.levelTestScore !== undefined ? (
                                        <Text style={{ marginBottom: 12 }}>
                                            <b>Тест уровня:</b> {progress.evaluation.levelTestScore} / 10 ({progress.evaluation.levelLabel})
                                        </Text>
                                    ) : (
                                        <Text style={{ marginBottom: 12 }}>
                                            <b>Тест уровня:</b> не пройден
                                        </Text>
                                    )}

                                    {progress.evaluation?.finalTestScore !== undefined ? (
                                        <>
                                            <Text style={{ marginBottom: 12 }}>
                                                <b>Итоговый тест:</b> {progress.evaluation.finalTestScore} / {progress.evaluation.finalTestTotal ?? 0} ({progress.evaluation.finalTestPercent ?? 0}%)
                                            </Text>

                                            <Text style={{ marginBottom: 12 }}>
                                                <b>Статус:</b> {progress.evaluation.finalTestPassed ? 'пройден' : 'завершён с ошибкой'}
                                            </Text>
                                        </>
                                    ) : (
                                        <Text style={{ marginBottom: 12 }}>
                                            <b>Итоговый тест:</b> не пройден
                                        </Text>
                                    )}

                                    {progress.evaluation?.efficiencyPercent !== undefined ? (
                                        <Text style={{ marginBottom: 12 }}>
                                            <b>Эффективность обучения:</b> {progress.evaluation.efficiencyPercent}% ({progress.evaluation.efficiencyLabel})
                                        </Text>
                                    ) : (
                                        <Text style={{ marginBottom: 12 }}>
                                            <b>Эффективность обучения:</b> недостаточно данных
                                        </Text>
                                    )}
                                </div>

                                <div style={progressCardStyle}>
                                    <Title level="3" weight="2" style={{ marginBottom: 12 }}>
                                        История прохождения
                                    </Title>

                                    {records.length === 0 && (
                                        <Text>
                                            Пока нет данных. Откройте обучающий сценарий и выполните несколько ходов.
                                        </Text>
                                    )}

                                    {records.map((item) => (
                                        <Card
                                            key={item.scenarioId}
                                            mode="shadow"
                                            style={{
                                                marginBottom: 12,
                                            }}
                                        >
                                            <div style={{ padding: 16 }}>
                                                <Text style={{ marginBottom: 6 }}>
                                                    <b>{item.title}</b>
                                                </Text>

                                                <Text style={{ marginBottom: 6 }}>
                                                    Тип: {item.scenarioType === 'opening' ? 'дебют' : 'тактика'}
                                                </Text>

                                                <Text style={{ marginBottom: 6 }}>
                                                    Статус: {item.status === 'completed' ? 'завершено' : 'начато'}
                                                </Text>

                                                {item.scenarioType === 'opening' && (
                                                    <Text style={{ marginBottom: 6 }}>
                                                        Шаг: {item.currentStep ?? 0}
                                                    </Text>
                                                )}

                                                <Text style={{ marginBottom: 6 }}>
                                                    Попытки: {item.attempts}
                                                </Text>

                                                <Text style={{ marginBottom: 6 }}>
                                                    Ошибки: {item.mistakes}
                                                </Text>

                                                {item.completedAt && (
                                                    <Text style={{ marginBottom: 8 }}>
                                                        Завершено: {new Date(item.completedAt).toLocaleString()}
                                                    </Text>
                                                )}

                                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                                                    <Button
                                                        size="s"
                                                        mode="secondary"
                                                        onClick={() => setPreviewScenarioId(item.scenarioId)}
                                                    >
                                                        Открыть позицию
                                                    </Button>

                                                    {item.status !== 'completed' && (
                                                        <Button
                                                            size="s"
                                                            onClick={() =>
                                                                handleOpenScenario(
                                                                    item.scenarioId,
                                                                    item.scenarioType,
                                                                    item.currentStep ?? 0,
                                                                )
                                                            }
                                                        >
                                                            Продолжить
                                                        </Button>
                                                    )}

                                                    <Button
                                                        size="s"
                                                        mode="outline"
                                                        appearance="negative"
                                                        onClick={() => void handleDelete(item.scenarioId)}
                                                    >
                                                        Удалить
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Panel>
    );
};
