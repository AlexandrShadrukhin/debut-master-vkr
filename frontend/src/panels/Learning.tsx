import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Chess } from 'chess.js';
import {
    Button,
    CardGrid,
    Group,
    Panel,
    PanelHeader,
    Text,
    Title,
} from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { ChessBoard } from '../components/ChessBoard';
import { TrainingCard } from '../components/training/TrainingCard';
import {
    openingScenarios,
    tacticScenarios,
    type OpeningScenario,
    type TacticScenario,
} from '../data/training';
import {
    consumeResumeRequest,
    markScenarioStarted,
    registerScenarioAttempt,
    markScenarioCompleted,
    updateScenarioPosition,
    saveLevelTestResult,
    saveFinalTestResult,
} from '../services/progress';

export type LearningProps = {
    id: string;
};

type LearningMode = 'menu' | 'tactics-list' | 'openings-list' | 'tactic' | 'opening' | 'level-test' | 'final-test';
type OpeningPhase = 'demo' | 'practice';

const levelQuestions = [
    { id: 'rules', text: 'Я знаю правила перемещения всех шахматных фигур.', weight: 1 },
    { id: 'checkmate', text: 'Я понимаю, что такое шах и мат.', weight: 1 },
    { id: 'notation', text: 'Я умею читать шахматную нотацию.', weight: 1 },
    { id: 'online', text: 'Я уже играл шахматные партии онлайн.', weight: 1 },
    { id: 'bot', text: 'Я играл против компьютерного соперника.', weight: 1 },
    { id: 'openings', text: 'Я знаю, что такое шахматный дебют.', weight: 1 },
    { id: 'openingStudy', text: 'Я раньше изучал шахматные дебюты.', weight: 1 },
    { id: 'center', text: 'Я понимаю основные принципы борьбы за центр.', weight: 1 },
    { id: 'development', text: 'Я понимаю принцип развития фигур в дебюте.', weight: 1 },
    { id: 'practice', text: 'Я могу повторить знакомый дебют без подсказок.', weight: 1 },
];

const catalogPanelStyle: CSSProperties = {
    padding: 24,
    width: '100%',
    height: 540,
    borderRadius: 16,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.04)',
    boxSizing: 'border-box',
    overflow: 'hidden',
};

const catalogCardScrollStyle: CSSProperties = {
    height: 440,
    maxHeight: 440,
    overflowY: 'auto',
    paddingRight: 8,
    paddingBottom: 4,
    boxSizing: 'border-box',
};

const fullPanelScrollStyle: CSSProperties = {
    height: '100%',
    overflowY: 'auto',
    paddingRight: 8,
    boxSizing: 'border-box',
};

const openingTrainingScrollStyle: CSSProperties = {
    height: 540,
    overflow: 'hidden',
    boxSizing: 'border-box',
};

const buildOpeningFen = (scenario: OpeningScenario, step: number) => {
    const game = new Chess(scenario.startingFen);

    for (let i = 0; i < step; i += 1) {
        const move = scenario.moves[i];

        if (!move) {
            break;
        }

        game.move({
            from: move.from,
            to: move.to,
            promotion: 'q',
        });
    }

    return game.fen();
};

export const Learning = ({ id }: LearningProps) => {
    const routeNavigator = useRouteNavigator();

    const [mode, setMode] = useState<LearningMode>('menu');
    const [selectedTacticId, setSelectedTacticId] = useState(tacticScenarios[0]?.id ?? '');
    const [selectedOpeningId, setSelectedOpeningId] = useState(openingScenarios[0]?.id ?? '');

    const [tacticFen, setTacticFen] = useState('');
    const [tacticStep, setTacticStep] = useState(0);

    const [resultText, setResultText] = useState('');
    const [showHint, setShowHint] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);

    const [openingPhase, setOpeningPhase] = useState<OpeningPhase>('demo');
    const [demoStep, setDemoStep] = useState(0);
    const [isAutoplayRunning, setIsAutoplayRunning] = useState(false);
    const [openingStep, setOpeningStep] = useState(0);
    const [openingBoardFen, setOpeningBoardFen] = useState('');
    const [openingStatusText, setOpeningStatusText] = useState('');
    const [showOpeningHint, setShowOpeningHint] = useState(false);
    const [levelAnswers, setLevelAnswers] = useState<Record<string, boolean>>({});
    const [levelResultText, setLevelResultText] = useState('');
    const [finalTestStep, setFinalTestStep] = useState(0);
    const [finalTestFen, setFinalTestFen] = useState('');
    const [finalTestFinished, setFinalTestFinished] = useState(false);
    const [finalTestResultText, setFinalTestResultText] = useState('');
    const [isOpeningWideLayout, setIsOpeningWideLayout] = useState(false);

    const tacticScenario: TacticScenario = useMemo(() => {
        return tacticScenarios.find((scenario) => scenario.id === selectedTacticId) ?? tacticScenarios[0];
    }, [selectedTacticId]);

    const openingScenario: OpeningScenario = useMemo(() => {
        return openingScenarios.find((scenario) => scenario.id === selectedOpeningId) ?? openingScenarios[0];
    }, [selectedOpeningId]);

    const finalTestScenario = useMemo(() => {
        return openingScenarios.find((item) => item.id === 'opening-slav-defense') ?? openingScenarios[0];
    }, []);

    const resetTrainingState = () => {
        setResultText('');
        setShowHint(false);
        setShowExplanation(false);
        setOpeningPhase('demo');
        setDemoStep(0);
        setIsAutoplayRunning(false);
        setOpeningStep(0);
        setOpeningBoardFen('');
        setOpeningStatusText('');
        setShowOpeningHint(false);
        setTacticFen('');
        setTacticStep(0);
        setLevelAnswers({});
        setLevelResultText('');
        setFinalTestStep(0);
        setFinalTestFen('');
        setFinalTestFinished(false);
        setFinalTestResultText('');
    };

    useEffect(() => {
        const request = consumeResumeRequest();

        if (!request) {
            return;
        }

        if (request.scenarioType === 'opening') {
            const scenario = openingScenarios.find((item) => item.id === request.scenarioId);

            if (!scenario) {
                return;
            }

            setSelectedOpeningId(scenario.id);
            resetTrainingState();
            setOpeningPhase('practice');
            setOpeningStep(request.step ?? 0);
            setOpeningBoardFen(buildOpeningFen(scenario, request.step ?? 0));
            setMode('opening');
            return;
        }

        if (request.scenarioType === 'tactic') {
            const scenario = tacticScenarios.find((item) => item.id === request.scenarioId);

            if (!scenario) {
                return;
            }

            setSelectedTacticId(scenario.id);
            resetTrainingState();
            setMode('tactic');
        }
    }, []);

    useEffect(() => {
        const updateOpeningLayout = () => {
            setIsOpeningWideLayout(window.innerWidth >= 900);
        };

        updateOpeningLayout();
        window.addEventListener('resize', updateOpeningLayout);

        return () => window.removeEventListener('resize', updateOpeningLayout);
    }, []);

    const handleBack = () => {
        if (mode === 'opening') {
            resetTrainingState();
            setMode('openings-list');
            return;
        }

        if (mode === 'tactic') {
            resetTrainingState();
            setMode('tactics-list');
            return;
        }

        if (
            mode === 'openings-list' ||
            mode === 'tactics-list' ||
            mode === 'level-test' ||
            mode === 'final-test'
        ) {
            resetTrainingState();
            setMode('menu');
            return;
        }

        routeNavigator.back();
    };

    const openTactic = (scenarioId: string) => {
        const scenario = tacticScenarios.find((item) => item.id === scenarioId);

        if (scenario) {
            void markScenarioStarted(scenario.id, 'tactic', scenario.title);
        }

        setSelectedTacticId(scenarioId);
        resetTrainingState();
        setMode('tactic');
    };

    const openOpening = (scenarioId: string) => {
        const scenario = openingScenarios.find((item) => item.id === scenarioId);

        if (scenario) {
            void markScenarioStarted(scenario.id, 'opening', scenario.title);
        }

        setSelectedOpeningId(scenarioId);
        resetTrainingState();
        setMode('opening');
    };

    const openLevelTest = () => {
        resetTrainingState();
        setMode('level-test');
    };

    const openFinalTest = () => {
        resetTrainingState();
        setFinalTestFen(buildOpeningFen(finalTestScenario, 0));
        setMode('final-test');
    };

    const handleTacticMoveSuccess = (from: string, to: string, fen: string) => {
        if (tacticScenario.id === 'mate-in-two-1') {
            if (from === 'a1' && to === 'h1') {
                void registerScenarioAttempt(tacticScenario.id, 'tactic', tacticScenario.title, true);

                setResultText('Верно: Лh1+. Чёрный король вынужден отойти на g8. Теперь найдите завершающий мат.');
                setShowExplanation(true);

                window.setTimeout(() => {
                    const game = new Chess(fen);

                    game.move({
                        from: 'h7',
                        to: 'g8',
                    });

                    setTacticFen(game.fen());
                    setTacticStep(1);
                }, 600);

                return;
            }

            if (tacticStep === 1 && from === 'h1' && to === 'h8') {
                void registerScenarioAttempt(tacticScenario.id, 'tactic', tacticScenario.title, true);
                void markScenarioCompleted(tacticScenario.id, 'tactic', tacticScenario.title, fen);

                setTacticStep(2);
                setResultText('Верно! Лh8# — мат.');
                setShowExplanation(true);
                return;
            }

            void registerScenarioAttempt(tacticScenario.id, 'tactic', tacticScenario.title, false);
            setResultText('Неверный ход. В этом сценарии нужно найти форсированный мат в 2 хода.');
            return;
        }

        const isCorrect =
            from === tacticScenario.correctMove.from &&
            to === tacticScenario.correctMove.to;

        void registerScenarioAttempt(tacticScenario.id, 'tactic', tacticScenario.title, isCorrect);

        if (isCorrect) {
            void markScenarioCompleted(tacticScenario.id, 'tactic', tacticScenario.title, fen);
            setResultText('Верно! Задача решена правильно.');
            setShowExplanation(true);
        } else {
            setResultText('Ход выполнен, но это не лучшее решение. Попробуйте ещё раз.');
        }
    };

    const handleTacticUndo = () => {
        setResultText('');
        setShowExplanation(false);

        if (tacticScenario.id !== 'mate-in-two-1') {
            return;
        }

        if (tacticStep >= 2) {
            const game = new Chess(tacticScenario.fen);

            game.move({
                from: 'a1',
                to: 'h1',
            });

            game.move({
                from: 'h7',
                to: 'g8',
            });

            setTacticFen(game.fen());
            setTacticStep(1);
            setResultText('Позиция после ответа чёрных. Найдите завершающий мат.');
            return;
        }

        setTacticFen('');
        setTacticStep(0);
    };

    const currentOpeningMove =
        openingPhase === 'demo'
            ? openingScenario.moves[Math.max(demoStep - 1, 0)]
            : openingScenario.moves[openingStep];

    const openingFen =
        openingPhase === 'demo'
            ? buildOpeningFen(openingScenario, demoStep)
            : buildOpeningFen(openingScenario, openingStep);

    useEffect(() => {
        if (!isAutoplayRunning || mode !== 'opening' || openingPhase !== 'demo') {
            return;
        }

        if (demoStep >= openingScenario.moves.length) {
            setIsAutoplayRunning(false);
            return;
        }

        const timer = window.setTimeout(() => {
            setDemoStep((prev) => Math.min(prev + 1, openingScenario.moves.length));
        }, 2500);

        return () => window.clearTimeout(timer);
    }, [isAutoplayRunning, demoStep, openingScenario, mode, openingPhase]);

    const handleNextDemoStep = () => {
        setIsAutoplayRunning(false);
        setDemoStep((prev) => Math.min(prev + 1, openingScenario.moves.length));
    };

    const handlePrevDemoStep = () => {
        setIsAutoplayRunning(false);
        setDemoStep((prev) => Math.max(prev - 1, 0));
    };

    const handleStartPractice = () => {
        setOpeningPhase('practice');
        setOpeningStep(0);
        setOpeningBoardFen(buildOpeningFen(openingScenario, 0));
        setOpeningStatusText('');
        setResultText('');
        setShowExplanation(false);
        setShowOpeningHint(false);
        setIsAutoplayRunning(false);
    };

    const handleBackToDemo = () => {
        setOpeningPhase('demo');
        setOpeningStep(0);
        setOpeningBoardFen('');
        setOpeningStatusText('');
        setResultText('');
        setShowExplanation(false);
        setShowOpeningHint(false);
        setIsAutoplayRunning(false);
    };

    const handleOpeningMoveSuccess = (from: string, to: string, fen: string, isExpectedMove?: boolean) => {
        const move = openingScenario.moves[openingStep];

        if (!move) {
            return;
        }

        const isCorrect = isExpectedMove ?? (from === move.from && to === move.to);

        void registerScenarioAttempt(openingScenario.id, 'opening', openingScenario.title, isCorrect);
        setOpeningBoardFen(fen);

        if (isCorrect) {
            const nextStep = openingStep + 1;

            void updateScenarioPosition(
                openingScenario.id,
                'opening',
                openingScenario.title,
                nextStep,
                fen,
            );

            setOpeningStep(nextStep);
            setOpeningStatusText(`Верно: ${move.notation}`);
            setShowExplanation(true);
            setShowOpeningHint(false);

            if (nextStep >= openingScenario.moves.length) {
                void markScenarioCompleted(openingScenario.id, 'opening', openingScenario.title, fen);
                setResultText('Дебют разыгран полностью.');
            } else {
                setResultText('Ход верный. Продолжайте повторение дебюта.');
            }
        } else {
            setOpeningStatusText(
                'Ошибка: ход не соответствует изучаемому дебюту. Нажмите «Отменить ход», чтобы вернуться к последней правильной позиции.',
            );
            setResultText('Ход выполнен, но он не входит в текущий дебютный сценарий.');
        }
    };

    const validateOpeningMove = (from: string, to: string) => {
        const move = openingScenario.moves[openingStep];

        if (!move) {
            return false;
        }

        return from === move.from && to === move.to;
    };

    const handleUndoOpening = () => {
        const nextFen = buildOpeningFen(openingScenario, openingStep);

        setOpeningBoardFen(nextFen);
        setOpeningStatusText('');
        setResultText('');
        setShowExplanation(false);
        setShowOpeningHint(false);
    };

    const handleResetOpening = () => {
        const nextFen = buildOpeningFen(openingScenario, 0);

        setOpeningStep(0);
        setOpeningBoardFen(nextFen);
        setOpeningStatusText('');
        setResultText('');
        setShowHint(false);
        setShowExplanation(false);
        setShowOpeningHint(false);

        void updateScenarioPosition(
            openingScenario.id,
            'opening',
            openingScenario.title,
            0,
            nextFen,
        );
    };

    const handleLevelAnswer = (questionId: string, answer: boolean) => {
        setLevelAnswers((prev) => ({
            ...prev,
            [questionId]: answer,
        }));
    };

    const handleFinishLevelTest = async () => {
        const score = levelQuestions.reduce(
            (sum, question) => sum + (levelAnswers[question.id] ? question.weight : 0),
            0,
        );
        const evaluation = await saveLevelTestResult(score, levelQuestions.length);

        setLevelResultText(`Результат записан. Уровень: ${evaluation.levelLabel ?? 'не определён'}.`);

        window.setTimeout(() => {
            setMode('menu');
        }, 1200);
    };

    const validateFinalTestMove = (from: string, to: string) => {
        const move = finalTestScenario.moves[finalTestStep];

        if (!move) {
            return false;
        }

        return from === move.from && to === move.to;
    };

    const handleFinalTestMoveSuccess = async (
        from: string,
        to: string,
        fen: string,
        isExpectedMove?: boolean,
    ) => {
        if (finalTestFinished) {
            return;
        }

        const move = finalTestScenario.moves[finalTestStep];

        if (!move) {
            return;
        }

        const isCorrect = isExpectedMove ?? (from === move.from && to === move.to);
        const total = finalTestScenario.moves.length;

        setFinalTestFen(fen);

        if (!isCorrect) {
            await saveFinalTestResult(finalTestStep, total, false);

            setFinalTestFinished(true);
            setFinalTestResultText('Тест завершён: допущена ошибка.');
            return;
        }

        const nextStep = finalTestStep + 1;
        setFinalTestStep(nextStep);

        if (nextStep >= total) {
            await saveFinalTestResult(nextStep, total, true);

            setFinalTestFinished(true);
            setFinalTestResultText('Итоговый тест пройден успешно.');
        }
    };

    const demoMoveIndex = Math.max(demoStep - 1, 0);
    const demoMoveIsWhite = demoMoveIndex % 2 === 0;

    const demoOverlayText =
        openingPhase === 'demo' && isAutoplayRunning && currentOpeningMove
            ? `${currentOpeningMove.notation}: ${currentOpeningMove.explanation}`
            : '';

    const practiceMoveIsWhite = openingStep % 2 === 0;
    const openingBoardStatusText =
        openingPhase === 'demo'
            ? demoStep % 2 === 0 ? 'Ход белых.' : 'Ход чёрных.'
            : practiceMoveIsWhite ? 'Ход белых.' : 'Ход чёрных.';

    const practiceHintText =
        openingPhase === 'practice' && showOpeningHint && currentOpeningMove
            ? `Подсказка: ${currentOpeningMove.pieceName} с ${currentOpeningMove.from} на ${currentOpeningMove.to}. ${currentOpeningMove.explanation}`
            : '';

    const answeredLevelQuestions = Object.keys(levelAnswers).length;
    const levelTestComplete = answeredLevelQuestions === levelQuestions.length;
    const finalTestTotal = finalTestScenario.moves.length;
    const finalTestPercent = finalTestTotal > 0
        ? Math.round((finalTestStep / finalTestTotal) * 100)
        : 0;

    return (
        <Panel id={id}>
            <PanelHeader>Обучение</PanelHeader>

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
                        <Button onClick={handleBack}>Назад</Button>

                        <Button mode="secondary" onClick={() => routeNavigator.push('/')}>
                            Главная
                        </Button>

                        <Button
                            mode={mode === 'menu' ? 'primary' : 'secondary'}
                            onClick={() => {
                                resetTrainingState();
                                setMode('menu');
                            }}
                        >
                            Разделы
                        </Button>

                        <Button
                            mode={mode.includes('tactic') ? 'primary' : 'secondary'}
                            onClick={() => {
                                resetTrainingState();
                                setMode('tactics-list');
                            }}
                        >
                            Тактика
                        </Button>

                        <Button
                            mode={mode.includes('opening') ? 'primary' : 'secondary'}
                            onClick={() => {
                                resetTrainingState();
                                setMode('openings-list');
                            }}
                        >
                            Дебюты
                        </Button>
                    </div>
                </Group>

                {mode === 'menu' && (
                    <Group>
                        <div style={catalogPanelStyle}>
                            <Title level="2" weight="2" style={{marginBottom: 12}}>
                                Выберите тип обучения
                            </Title>

                            <Text style={{marginBottom: 16}}>
                                В разделе доступны тактические задачи и обучение популярным шахматным дебютам.
                            </Text>

                            <div style={catalogCardScrollStyle}>
                                <CardGrid size="l">
                                    <TrainingCard
                                        title="Проверка уровня"
                                        description="Ответьте на вопросы, чтобы определить стартовый уровень подготовки."
                                        label="10 вопросов"
                                        onClick={openLevelTest}
                                    />

                                    <TrainingCard
                                        title="Тактические задачи"
                                        description="Мат в один ход, выигрыш материала, защита и типовые позиции."
                                        label={`${tacticScenarios.length} задач`}
                                        onClick={() => setMode('tactics-list')}
                                    />

                                    <TrainingCard
                                        title="Дебюты"
                                        description="Пошаговое изучение популярных дебютов с объяснением каждого хода."
                                        label={`${openingScenarios.length} дебютов`}
                                        onClick={() => setMode('openings-list')}
                                    />

                                    <TrainingCard
                                        title="Итоговый тест"
                                        description="Проверьте, насколько хорошо вы запомнили славянскую защиту."
                                        label="Славянская защита"
                                        onClick={openFinalTest}
                                    />
                                </CardGrid>
                            </div>
                        </div>
                    </Group>
                )}

                {mode === 'tactics-list' && (
                    <Group>
                        <div style={catalogPanelStyle}>
                            <Title level="2" weight="2" style={{marginBottom: 12}}>
                                Тактические задачи
                            </Title>

                            <Text style={{marginBottom: 16}}>
                                Задачи на мат, выигрыш материала, защиту и типовые комбинации.
                            </Text>

                            <div style={catalogCardScrollStyle}>
                                <CardGrid size="l">
                                    {tacticScenarios.map((scenario) => (
                                        <TrainingCard
                                            key={scenario.id}
                                            title={scenario.title}
                                            description={scenario.description}
                                            label={scenario.theme}
                                            onClick={() => openTactic(scenario.id)}
                                        />
                                    ))}
                                </CardGrid>
                            </div>
                        </div>
                    </Group>
                )}

                {mode === 'openings-list' && (
                    <Group>
                        <div style={catalogPanelStyle}>
                            <Title level="2" weight="2" style={{marginBottom: 12}}>
                                Дебюты
                            </Title>

                            <Text style={{marginBottom: 16}}>
                                Пошаговое изучение популярных шахматных дебютов с объяснением ходов.
                            </Text>

                            <div style={catalogCardScrollStyle}>
                                <CardGrid size="l">
                                    {openingScenarios.map((scenario) => (
                                        <TrainingCard
                                            key={scenario.id}
                                            title={scenario.title}
                                            description={scenario.description}
                                            label={`${Math.ceil(scenario.moves.length / 2)} ходов`}
                                            onClick={() => openOpening(scenario.id)}
                                        />
                                    ))}
                                </CardGrid>
                            </div>
                        </div>
                    </Group>
                )}

                {mode === 'level-test' && (
                    <Group>
                        <div style={catalogPanelStyle}>
                            <div style={fullPanelScrollStyle}>
                                <Title level="2" weight="2" style={{marginBottom: 12}}>
                                    Проверка уровня
                                </Title>

                                <Text style={{marginBottom: 16}}>
                                    Ответьте на вопросы, чтобы определить стартовый уровень подготовки.
                                </Text>

                                <div
                                    style={{
                                        display: 'grid',
                                        gap: 12,
                                        marginBottom: 16,
                                    }}
                                >
                                    {levelQuestions.map((question) => {
                                        const answer = levelAnswers[question.id];
                                        // noinspection PointlessBooleanExpressionJS
                                        const isYesSelected = answer === true;
                                        // noinspection PointlessBooleanExpressionJS
                                        const isNoSelected = answer === false;

                                        return (
                                            <div
                                                key={question.id}
                                                style={{
                                                    padding: 12,
                                                    borderRadius: 12,
                                                    background: 'rgba(255,255,255,0.06)',
                                                }}
                                            >
                                                <Text style={{marginBottom: 10}}>
                                                    {question.text}
                                                </Text>

                                                <div style={{display: 'flex', gap: 8}}>
                                                    <Button
                                                        size="s"
                                                        mode={isYesSelected ? 'primary' : 'secondary'}
                                                        onClick={() => handleLevelAnswer(question.id, true)}
                                                    >
                                                        Да
                                                    </Button>

                                                    <Button
                                                        size="s"
                                                        mode={isNoSelected ? 'primary' : 'secondary'}
                                                        onClick={() => handleLevelAnswer(question.id, false)}
                                                    >
                                                        Нет
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <Button
                                    stretched
                                    size="l"
                                    disabled={!levelTestComplete || Boolean(levelResultText)}
                                    onClick={() => void handleFinishLevelTest()}
                                    style={{marginBottom: 12}}
                                >
                                    Завершить тест
                                </Button>

                                <Text style={{marginBottom: 12}}>
                                    <b>Ответов:</b> {answeredLevelQuestions} / {levelQuestions.length}
                                </Text>

                                {levelResultText && (
                                    <Text style={{marginBottom: 12}}>
                                        {levelResultText}
                                    </Text>
                                )}
                            </div>
                        </div>
                    </Group>
                )}

                {mode === 'final-test' && (
                    <Group>
                        <div style={catalogPanelStyle}>
                            <div
                                style={{
                                    height: '100%',
                                    display: 'grid',
                                    gridTemplateColumns: isOpeningWideLayout ? 'minmax(0, 1fr) 360px' : '1fr',
                                    gap: isOpeningWideLayout ? 16 : 12,
                                    alignItems: 'stretch',
                                }}
                            >
                                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 0}}>
                                    <ChessBoard
                                        key={finalTestScenario.id}
                                        initialFen={finalTestFen || buildOpeningFen(finalTestScenario, finalTestStep)}
                                        onMoveSuccess={finalTestFinished ? undefined : handleFinalTestMoveSuccess}
                                        validateMove={finalTestFinished ? undefined : validateFinalTestMove}
                                        disableUndo
                                        readOnly={finalTestFinished}
                                        maxBoardWidth={660}
                                        reservedHeightOverride={260}
                                        hideInfoPanel
                                    />
                                </div>

                                <div
                                    style={{
                                        padding: 16,
                                        height: '100%',
                                        overflowY: 'auto',
                                        paddingRight: 8,
                                        borderRadius: 20,
                                        border: '1px solid rgba(255,255,255,0.12)',
                                        background: 'rgba(255,255,255,0.04)',
                                        boxSizing: 'border-box',
                                    }}
                                >
                                    <Text style={{marginBottom: 12}}>
                                        <b>Итоговый тест</b> — повторите славянскую защиту без подсказок.
                                    </Text>

                                    <Title level="2" weight="2" style={{marginBottom: 12}}>
                                        Славянская защита
                                    </Title>

                                    <Text style={{marginBottom: 12}}>
                                        <b>Прогресс:</b> {finalTestStep} / {finalTestTotal}
                                    </Text>

                                    {finalTestFinished ? (
                                        <>
                                            <Text style={{marginBottom: 12}}>
                                                {finalTestResultText}
                                            </Text>

                                            <Text style={{marginBottom: 12}}>
                                                <b>Результат:</b> {finalTestStep} / {finalTestTotal}
                                            </Text>

                                            <Text style={{marginBottom: 12}}>
                                                <b>Процент:</b> {finalTestPercent}%
                                            </Text>

                                            <Text style={{marginBottom: 12}}>
                                                Результат сохранён в прогресс.
                                            </Text>
                                        </>
                                    ) : (
                                        <Text style={{marginBottom: 12}}>
                                            Делайте ходы по памяти. При первой ошибке тест завершится автоматически.
                                        </Text>
                                    )}

                                    <Button stretched mode="tertiary" onClick={handleBack}>
                                        Вернуться к разделам
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Group>
                )}

                {mode === 'tactic' && tacticScenario && (
                    <div style={openingTrainingScrollStyle}>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: isOpeningWideLayout ? 'minmax(0, 1fr) 360px' : '1fr',
                                gap: isOpeningWideLayout ? 16 : 12,
                                alignItems: 'stretch',
                                height: '100%',
                            }}
                        >
                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 0}}>
                                <ChessBoard
                                    key={`${tacticScenario.id}-${tacticStep}`}
                                    initialFen={tacticFen || tacticScenario.fen}
                                    onMoveSuccess={handleTacticMoveSuccess}
                                    onUndoOverride={handleTacticUndo}
                                    maxBoardWidth={660}
                                    reservedHeightOverride={260}
                                    hideInfoPanel
                                />
                            </div>

                            <div
                                style={{
                                    padding: 16,
                                    height: isOpeningWideLayout ? '100%' : undefined,
                                    overflowY: isOpeningWideLayout ? 'auto' : undefined,
                                    paddingRight: 8,
                                    borderRadius: 20,
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    background: 'rgba(255,255,255,0.04)',
                                    boxSizing: 'border-box',
                                }}
                            >
                                <Title level="2" weight="2" style={{marginBottom: 12}}>
                                    Тактический сценарий
                                </Title>

                                <Text style={{marginBottom: 12}}>
                                    <b>{tacticScenario.title}</b>
                                </Text>

                                <Text style={{marginBottom: 12}}>
                                    {tacticScenario.description}
                                </Text>

                                <Text style={{marginBottom: 12}}>
                                    <b>Тема:</b> {tacticScenario.theme}
                                </Text>

                                <Text style={{marginBottom: 12}}>
                                    <b>Результат:</b> {resultText || 'Пока ход не сделан'}
                                </Text>

                                <div style={{display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap'}}>
                                    <Button stretched onClick={handleTacticUndo}>
                                        Отменить ход
                                    </Button>

                                    <Button
                                        stretched
                                        mode="secondary"
                                        onClick={() => {
                                            setTacticFen('');
                                            setTacticStep(0);
                                            setResultText('');
                                            setShowExplanation(false);
                                            setShowHint(false);
                                        }}
                                    >
                                        Сбросить
                                    </Button>
                                </div>

                                <div style={{display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap'}}>
                                    <Button stretched onClick={() => setShowHint((prev) => !prev)}>
                                        {showHint ? 'Скрыть подсказку' : 'Показать подсказку'}
                                    </Button>

                                    <Button stretched mode="secondary"
                                            onClick={() => setShowExplanation((prev) => !prev)}>
                                        {showExplanation ? 'Скрыть разбор' : 'Показать разбор'}
                                    </Button>
                                </div>

                                <Button stretched mode="tertiary" onClick={() => setMode('tactics-list')}>
                                    Вернуться к списку задач
                                </Button>

                                {showHint && (
                                    <Text style={{marginTop: 12, marginBottom: 12}}>
                                        <b>Подсказка:</b> {tacticScenario.hint}
                                    </Text>
                                )}

                                {showExplanation && (
                                    <Text style={{marginTop: 12}}>
                                        <b>Разбор:</b> {tacticScenario.explanation}
                                    </Text>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {mode === 'opening' && openingScenario && (
                    <div style={openingTrainingScrollStyle}>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: isOpeningWideLayout ? 'minmax(0, 1fr) 360px' : '1fr',
                                gap: isOpeningWideLayout ? 16 : 12,
                                alignItems: 'stretch',
                                height: '100%',
                            }}
                        >
                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 0}}>
                                <ChessBoard
                                    key={`${openingScenario.id}-${openingPhase}`}
                                    initialFen={openingBoardFen || openingFen}
                                    topOverlay={
                                        openingPhase === 'demo' && isAutoplayRunning && demoMoveIsWhite
                                            ? demoOverlayText
                                            : openingPhase === 'practice' && practiceMoveIsWhite
                                                ? practiceHintText
                                                : undefined
                                    }
                                    bottomOverlay={
                                        openingPhase === 'demo' && isAutoplayRunning && !demoMoveIsWhite
                                            ? demoOverlayText
                                            : openingPhase === 'practice' && !practiceMoveIsWhite
                                                ? practiceHintText
                                                : undefined
                                    }
                                    onMoveSuccess={openingPhase === 'practice' ? handleOpeningMoveSuccess : undefined}
                                    validateMove={openingPhase === 'practice' ? validateOpeningMove : undefined}
                                    onUndoOverride={openingPhase === 'practice' ? handleUndoOpening : undefined}
                                    onResetOverride={openingPhase === 'practice' ? handleResetOpening : undefined}
                                    disableUndo={openingPhase === 'practice' ? !openingBoardFen : true}
                                    readOnly={openingPhase === 'demo'}
                                    maxBoardWidth={660}
                                    reservedHeightOverride={260}
                                    hideInfoPanel
                                />
                            </div>

                            <div
                                style={{
                                    padding: 16,
                                    height: isOpeningWideLayout ? '100%' : undefined,
                                    overflowY: isOpeningWideLayout ? 'auto' : undefined,
                                    paddingRight: 8,
                                    borderRadius: 20,
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    background: 'rgba(255,255,255,0.04)',
                                    boxSizing: 'border-box',
                                }}
                            >
                                <Title level="2" weight="2" style={{marginBottom: 12}}>
                                    Дебютный тренажёр
                                </Title>

                                <Text style={{marginBottom: 12}}>
                                    <b>Дебют:</b> {openingScenario.openingName}
                                </Text>

                                <Text style={{marginBottom: 12}}>
                                    <b>Режим:</b>{' '}
                                    {openingPhase === 'demo' ? 'показ правильной разыгровки' : 'самостоятельное повторение'}
                                </Text>

                                <Text style={{marginBottom: 12}}>
                                    <b>{openingScenario.title}</b>
                                </Text>

                                <Text style={{marginBottom: 12}}>
                                    {openingScenario.description}
                                </Text>

                                <Text style={{marginBottom: 12}}>
                                    <b>Статус:</b> {openingBoardStatusText}
                                </Text>

                                {openingPhase === 'demo' && (
                                    <>
                                        <Text style={{marginBottom: 12}}>
                                            <b>Шаг:</b>{' '}
                                            {demoStep === 0 ? 'начальная позиция' : `${demoStep} / ${openingScenario.moves.length}`}
                                        </Text>

                                        {demoStep === 0 && (
                                            <Text style={{marginBottom: 12}}>
                                                Нажмите «Следующий ход» или «Автопоказ», чтобы посмотреть разыгровку
                                                дебюта.
                                            </Text>
                                        )}

                                        {demoStep >= openingScenario.moves.length && (
                                            <Text style={{marginBottom: 12}}>
                                                <b>Итог дебюта:</b> {openingScenario.resultDescription}
                                            </Text>
                                        )}

                                        <div style={{display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap'}}>
                                            <Button stretched onClick={handlePrevDemoStep} disabled={demoStep === 0}>
                                                Назад по ходу
                                            </Button>

                                            <Button
                                                stretched
                                                onClick={handleNextDemoStep}
                                                disabled={demoStep >= openingScenario.moves.length}
                                            >
                                                Следующий ход
                                            </Button>
                                        </div>

                                        <div style={{display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap'}}>
                                            <Button
                                                stretched
                                                mode="secondary"
                                                onClick={() => setIsAutoplayRunning((prev) => !prev)}
                                                disabled={demoStep >= openingScenario.moves.length}
                                            >
                                                {isAutoplayRunning ? 'Остановить автопоказ' : 'Проиграть автоматически'}
                                            </Button>

                                            <Button stretched onClick={handleStartPractice}>
                                                Повторить самостоятельно
                                            </Button>
                                        </div>

                                        <Button stretched mode="tertiary" onClick={() => setMode('openings-list')}>
                                            Вернуться к списку дебютов
                                        </Button>
                                    </>
                                )}

                                {openingPhase === 'practice' && (
                                    <>
                                        <Text style={{marginBottom: 12}}>
                                            <b>Прогресс:</b>{' '}
                                            {openingStep < openingScenario.moves.length
                                                ? `${openingStep + 1} / ${openingScenario.moves.length}`
                                                : `завершено (${openingScenario.moves.length} / ${openingScenario.moves.length})`}
                                        </Text>

                                        <Text style={{marginBottom: 12}}>
                                            <b>Статус:</b> {openingStatusText || 'сделайте следующий ход дебюта'}
                                        </Text>

                                        <Text style={{marginBottom: 12}}>
                                            <b>Итог:</b> {resultText || 'повторяйте дебют по памяти'}
                                        </Text>

                                        {currentOpeningMove ? (
                                            <>
                                                <Text style={{marginBottom: 12}}>
                                                    Сделайте следующий ход самостоятельно. Подсказку можно включить
                                                    отдельной кнопкой.
                                                </Text>

                                                <Button
                                                    stretched
                                                    mode="secondary"
                                                    style={{marginBottom: 12}}
                                                    onClick={() => setShowOpeningHint((prev) => !prev)}
                                                >
                                                    {showOpeningHint ? 'Скрыть подсказку' : 'Показать подсказку'}
                                                </Button>
                                            </>
                                        ) : (
                                            <Text style={{marginBottom: 12}}>
                                                <b>Результат дебюта:</b> {openingScenario.resultDescription}
                                            </Text>
                                        )}

                                        <div style={{display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap'}}>
                                            <Button stretched onClick={handleUndoOpening} disabled={!openingBoardFen}>
                                                Отменить ход
                                            </Button>

                                            <Button stretched mode="secondary" onClick={handleResetOpening}>
                                                Начать заново
                                            </Button>

                                            <Button stretched mode="tertiary" onClick={handleBackToDemo}>
                                                Вернуться к показу
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Panel>
    );
};
