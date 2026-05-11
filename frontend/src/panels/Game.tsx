import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Chess, type Square } from 'chess.js';
import {
    Button,
    Group,
    Input,
    Panel,
    PanelHeader,
    Text,
    Title,
} from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { Chessboard } from 'react-chessboard';
import { getStockfishMove, type BotDifficulty } from '../services/chess/stockfishEngine';
import {
    createRoom,
    joinRoom,
    getRoom,
    leaveRoom,
    finishRoom,
    getPlayerRooms,
    type RoomResponse,
} from '../services/online/onlineGameApi';
import { createOnlineGameSocket } from '../services/online/onlineGameSocket';
import { getAppPlayerId } from '../services/vk/vkUser';

export type GameProps = {
    id: string;
};

type GameMode = 'menu' | 'local' | 'bot' | 'online';

type PieceDropArgs = {
    sourceSquare: string;
    targetSquare: string | null;
};

type SquareClickArgs = {
    square: string;
};

const ONLINE_ROOM_KEY = 'vk_chess_online_room_code';

export const Game = ({ id }: GameProps) => {
    const routeNavigator = useRouteNavigator();

    const socketRef = useRef<ReturnType<typeof createOnlineGameSocket> | null>(null);
    const roomRef = useRef<RoomResponse | null>(null);

    const [mode, setMode] = useState<GameMode>('menu');
    const [botDifficulty, setBotDifficulty] = useState<BotDifficulty>('easy');
    const [game, setGame] = useState(() => new Chess());
    const [fenHistory, setFenHistory] = useState<string[]>([]);
    const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
    const [boardWidth, setBoardWidth] = useState(320);
    const [isGameWideLayout, setIsGameWideLayout] = useState(false);
    const [botThinking, setBotThinking] = useState(false);

    const [playerId, setPlayerId] = useState('');

    useEffect(() => {
        const loadPlayer = async () => {
            const id = await getAppPlayerId();
            setPlayerId(id);
        };

        void loadPlayer();
    }, []);

    const [roomCodeInput, setRoomCodeInput] = useState('');
    const [room, setRoom] = useState<RoomResponse | null>(null);
    const [onlineError, setOnlineError] = useState('');
    const [onlineLoading, setOnlineLoading] = useState(false);
    const [onlineHistory, setOnlineHistory] = useState<RoomResponse[]>([]);

    useEffect(() => {
        roomRef.current = room;
    }, [room]);

    useEffect(() => {
        const updateBoardWidth = () => {
            const isDesktop = window.innerWidth >= 768;
            const viewportHeight = window.visualViewport?.height ?? window.innerHeight;

            const horizontalPadding = isDesktop ? 96 : 32;

            const reservedHeight =
                mode === 'online'
                    ? isDesktop
                        ? 290
                        : 360
                    : isDesktop
                        ? 250
                        : 280;

            const maxByWidth = window.innerWidth - horizontalPadding;
            const maxByHeight = viewportHeight - reservedHeight;

            const nextSize = Math.min(maxByWidth, maxByHeight, 560);

            setBoardWidth(Math.max(220, nextSize));
        };

        updateBoardWidth();

        window.addEventListener('resize', updateBoardWidth);
        window.visualViewport?.addEventListener('resize', updateBoardWidth);

        return () => {
            window.removeEventListener('resize', updateBoardWidth);
            window.visualViewport?.removeEventListener('resize', updateBoardWidth);
        };
    }, [mode, room?.code]);

    useEffect(() => {
        const updateGameLayout = () => {
            setIsGameWideLayout(window.innerWidth >= 900);
        };

        updateGameLayout();
        window.addEventListener('resize', updateGameLayout);

        return () => window.removeEventListener('resize', updateGameLayout);
    }, []);

    useEffect(() => {
        const sendLeaveBeacon = () => {
            const currentRoom = roomRef.current;

            if (!currentRoom) {
                return;
            }

            navigator.sendBeacon(
                `https://vk-chess-backend.onrender.com/api/rooms/${currentRoom.code}/leave`,
                new Blob(
                    [JSON.stringify({ playerId })],
                    { type: 'application/json' },
                ),
            );
        };

        const handleBeforeUnload = () => {
            sendLeaveBeacon();
        };

        const handleVisibilityChange = () => {
            const currentRoom = roomRef.current;

            if (!currentRoom) {
                return;
            }

            if (document.hidden) {
                void leaveRoom(currentRoom.code, playerId);
                return;
            }

            void joinRoom(currentRoom.code, playerId).then((updatedRoom) => {
                setRoom(updatedRoom);
                setGame(new Chess(updatedRoom.fen));
                connectSocket(updatedRoom.code);
            });
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            socketRef.current?.disconnect();
        };
    }, [playerId]);

    const playerColor = useMemo(() => {
        if (!room) {
            return null;
        }

        if (room.whitePlayerId === playerId) {
            return 'w';
        }

        if (room.blackPlayerId === playerId) {
            return 'b';
        }

        return null;
    }, [room, playerId]);

    const isMyOnlineTurn = mode !== 'online' || !room || playerColor === game.turn();

    const statusText = useMemo(() => {
        if (game.isCheckmate()) {
            return game.turn() === 'w' ? 'Мат. Победили чёрные.' : 'Мат. Победили белые.';
        }

        if (game.isDraw()) {
            return 'Ничья.';
        }

        if (mode === 'bot' && game.turn() === 'b') {
            return botThinking ? 'Компьютер думает...' : 'Ход компьютера.';
        }

        if (mode === 'online') {
            if (!room) {
                return 'Комната не создана.';
            }

            if (room.status === 'WAITING') {
                return 'Ожидание второго игрока.';
            }

            if (!playerColor) {
                return 'Вы наблюдатель.';
            }

            return playerColor === game.turn() ? 'Ваш ход.' : 'Ход соперника.';
        }

        const turnText = game.turn() === 'w' ? 'Ход белых' : 'Ход чёрных';
        const checkText = game.isCheck() ? ' Шах.' : '';

        return `${turnText}.${checkText}`;
    }, [game, mode, botThinking, room, playerColor]);

    const availableMoves = useMemo(() => {
        if (!selectedSquare) {
            return [];
        }

        try {
            return game.moves({
                square: selectedSquare,
                verbose: true,
            });
        } catch {
            return [];
        }
    }, [game, selectedSquare]);

    const resetGame = () => {
        setGame(new Chess());
        setFenHistory([]);
        setSelectedSquare(null);
        setBotThinking(false);
    };

    const disconnectOnline = () => {
        socketRef.current?.disconnect();
        socketRef.current = null;
        setRoom(null);
        setOnlineError('');
    };

    const leaveOnlineRoom = async () => {
        if (room) {
            try {
                await leaveRoom(room.code, playerId);
            } catch {
                // ничего страшного, локально всё равно выйдем
            }
        }

        disconnectOnline();
        localStorage.removeItem(ONLINE_ROOM_KEY);
    };

    const goHome = async () => {
        if (mode === 'online') {
            await leaveOnlineRoom();
        }

        routeNavigator.push('/');
    };

    const copyRoomCode = async () => {
        if (!room?.code) {
            return;
        }

        await navigator.clipboard.writeText(room.code);
    };

    const startLocalGame = () => {
        disconnectOnline();
        resetGame();
        setMode('local');
    };

    const startBotGame = (difficulty: BotDifficulty) => {
        disconnectOnline();
        resetGame();
        setBotDifficulty(difficulty);
        setMode('bot');
    };

    const connectSocket = (roomCode: string) => {
        socketRef.current?.disconnect();

        socketRef.current = createOnlineGameSocket(roomCode, (updatedRoom) => {
            setRoom(updatedRoom);
            setGame(new Chess(updatedRoom.fen));
            setSelectedSquare(null);
        });
    };

    useEffect(() => {
        const savedRoomCode = localStorage.getItem(ONLINE_ROOM_KEY);

        if (!savedRoomCode) {
            return;
        }

        const restoreRoom = async () => {
            try {
                const restoredRoom = await getRoom(savedRoomCode);

                setRoom(restoredRoom);
                setGame(new Chess(restoredRoom.fen));
                setFenHistory([]);
                setSelectedSquare(null);
                setMode('online');

                connectSocket(restoredRoom.code);
            } catch {
                localStorage.removeItem(ONLINE_ROOM_KEY);
            }
        };

        void restoreRoom();
    }, []);

    const loadOnlineHistory = async () => {
        try {
            const rooms = await getPlayerRooms(playerId);
            setOnlineHistory(rooms);
        } catch {
            setOnlineHistory([]);
        }
    };

    useEffect(() => {
        if (mode === 'menu' && playerId) {
            void loadOnlineHistory();
        }
    }, [mode, playerId]);

    const handleOpenHistoryRoom = async (code: string) => {
        try {
            setOnlineLoading(true);
            setOnlineError('');

            const restoredRoom = await getRoom(code);

            setRoom(restoredRoom);
            setGame(new Chess(restoredRoom.fen));
            setFenHistory([]);
            setSelectedSquare(null);
            setMode('online');
            localStorage.setItem(ONLINE_ROOM_KEY, restoredRoom.code);

            if (restoredRoom.status !== 'FINISHED') {
                await joinRoom(restoredRoom.code, playerId);
                connectSocket(restoredRoom.code);
            }
        } catch {
            setOnlineError('Не удалось открыть партию из истории.');
        } finally {
            setOnlineLoading(false);
        }
    };

    const handleResign = async () => {
        if (!room || !playerColor) {
            return;
        }

        const winnerColor = playerColor === 'w' ? 'b' : 'w';

        try {
            const finishedRoom = await finishRoom(
                room.code,
                playerId,
                winnerColor,
                'Сдача партии',
            );

            setRoom(finishedRoom);
            setGame(new Chess(finishedRoom.fen));
        } catch {
            setOnlineError('Не удалось сдаться.');
        }
    };

    const handleCreateOnlineRoom = async () => {
        try {
            setOnlineLoading(true);
            setOnlineError('');

            const createdRoom = await createRoom(playerId);

            disconnectOnline();
            setRoom(createdRoom);
            setGame(new Chess(createdRoom.fen));
            setFenHistory([]);
            setSelectedSquare(null);
            setMode('online');
            localStorage.setItem(ONLINE_ROOM_KEY, createdRoom.code);

            connectSocket(createdRoom.code);
        } catch {
            setOnlineError('Не удалось создать комнату.');
        } finally {
            setOnlineLoading(false);
        }
    };

    const handleJoinOnlineRoom = async () => {
        const code = roomCodeInput.trim().toUpperCase();

        if (!code) {
            setOnlineError('Введите код комнаты.');
            return;
        }

        try {
            setOnlineLoading(true);
            setOnlineError('');

            const joinedRoom = await joinRoom(code, playerId);

            disconnectOnline();
            setRoom(joinedRoom);
            setGame(new Chess(joinedRoom.fen));
            setFenHistory([]);
            setSelectedSquare(null);
            setMode('online');
            localStorage.setItem(ONLINE_ROOM_KEY, joinedRoom.code);

            connectSocket(joinedRoom.code);
        } catch {
            setOnlineError('Не удалось подключиться к комнате.');
        } finally {
            setOnlineLoading(false);
        }
    };

    const applyMove = (from: Square, to: Square, promotion = 'q') => {
        try {
            if (mode === 'bot' && game.turn() === 'b') {
                return false;
            }

            if (mode === 'online') {
                if (!room || room.status !== 'ACTIVE' || !isMyOnlineTurn || !playerColor) {
                    return false;
                }
            }

            if (botThinking) {
                return false;
            }

            const currentFen = game.fen();
            const copy = new Chess(currentFen);

            const move = copy.move({
                from,
                to,
                promotion,
            });

            if (!move) {
                return false;
            }

            const nextFen = copy.fen();

            setFenHistory((prev) => [...prev, currentFen]);
            setGame(copy);
            setSelectedSquare(null);

            if (mode === 'online' && room) {
                socketRef.current?.sendMove({
                    playerId,
                    from,
                    to,
                    promotion,
                    fenAfter: nextFen,
                });
            }

            if (mode === 'online' && room) {
                if (copy.isCheckmate()) {
                    void finishRoom(
                        room.code,
                        playerId,
                        copy.turn() === 'w' ? 'b' : 'w',
                        'Мат',
                    );
                }

                if (copy.isDraw()) {
                    void finishRoom(
                        room.code,
                        playerId,
                        null,
                        'Ничья',
                    );
                }
            }

            return true;
        } catch {
            return false;
        }
    };

    useEffect(() => {
        if (mode !== 'bot') {
            return;
        }

        if (game.turn() !== 'b' || game.isGameOver()) {
            return;
        }

        let cancelled = false;

        const makeBotMove = async () => {
            setBotThinking(true);

            try {
                const currentFen = game.fen();
                const bestMove = await getStockfishMove(currentFen, botDifficulty);

                if (cancelled || !bestMove) {
                    return;
                }

                const from = bestMove.slice(0, 2) as Square;
                const to = bestMove.slice(2, 4) as Square;
                const promotion = bestMove.slice(4, 5) || 'q';

                const copy = new Chess(currentFen);

                const move = copy.move({
                    from,
                    to,
                    promotion,
                });

                if (!move) {
                    return;
                }

                setFenHistory((prev) => [...prev, currentFen]);
                setGame(copy);
                setSelectedSquare(null);
            } finally {
                if (!cancelled) {
                    setBotThinking(false);
                }
            }
        };

        const timer = window.setTimeout(() => {
            void makeBotMove();
        }, 400);

        return () => {
            cancelled = true;
            window.clearTimeout(timer);
        };
    }, [game, mode, botDifficulty]);

    const handlePieceDrop = ({ sourceSquare, targetSquare }: PieceDropArgs) => {
        if (!targetSquare) {
            return false;
        }

        return applyMove(sourceSquare as Square, targetSquare as Square);
    };

    const handleSquareClick = ({ square }: SquareClickArgs) => {
        if (mode === 'bot' && game.turn() === 'b') {
            return;
        }

        if (mode === 'online' && !isMyOnlineTurn) {
            return;
        }

        if (botThinking) {
            return;
        }

        const clickedSquare = square as Square;
        const clickedPiece = game.get(clickedSquare);

        if (!selectedSquare) {
            if (!clickedPiece) {
                return;
            }

            if (clickedPiece.color !== game.turn()) {
                return;
            }

            if (mode === 'online' && clickedPiece.color !== playerColor) {
                return;
            }

            setSelectedSquare(clickedSquare);
            return;
        }

        if (selectedSquare === clickedSquare) {
            setSelectedSquare(null);
            return;
        }

        if (clickedPiece && clickedPiece.color === game.turn()) {
            if (mode === 'online' && clickedPiece.color !== playerColor) {
                return;
            }

            setSelectedSquare(clickedSquare);
            return;
        }

        applyMove(selectedSquare, clickedSquare);
    };

    const undoMove = () => {
        if (fenHistory.length === 0 || botThinking || mode === 'online') {
            return;
        }

        if (mode === 'bot') {
            const previousFen = fenHistory[Math.max(fenHistory.length - 2, 0)];
            setGame(new Chess(previousFen));
            setFenHistory((prev) => prev.slice(0, Math.max(prev.length - 2, 0)));
            setSelectedSquare(null);
            return;
        }

        const previousFen = fenHistory[fenHistory.length - 1];
        setGame(new Chess(previousFen));
        setFenHistory((prev) => prev.slice(0, -1));
        setSelectedSquare(null);
    };

    const squareStyles: Record<string, CSSProperties> = {
        ...(selectedSquare
            ? {
                [selectedSquare]: {
                    backgroundColor: 'rgba(255, 215, 0, 0.45)',
                },
            }
            : {}),
    };

    availableMoves.forEach((move) => {
        squareStyles[move.to] = {
            background:
                'radial-gradient(circle, rgba(80,180,120,0.65) 0%, rgba(80,180,120,0.45) 35%, rgba(80,180,120,0.15) 70%)',
            borderRadius: '50%',
        };
    });

    if (!playerId) {
        return (
            <Panel id={id}>
                <PanelHeader>Игра</PanelHeader>
                <div
                    style={{
                        paddingBottom: 160,
                        maxWidth: 980,
                        margin: '0 auto',
                        width: '100%',
                    }}
                >
                    <Group>
                        <div style={{ padding: 16 }}>
                            <Text>Загрузка пользователя...</Text>
                        </div>
                    </Group>
                </div>
            </Panel>
        );
    }

    return (
        <Panel id={id}>
            <PanelHeader>Игра</PanelHeader>

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
                        <Button
                            onClick={async () => {
                                if (mode === 'online') {
                                    await leaveOnlineRoom();
                                }

                                routeNavigator.back();
                            }}
                        >
                            Назад
                        </Button>

                        <Button mode="secondary" onClick={() => void goHome()}>
                            Главная
                        </Button>

                        {mode !== 'menu' && (
                            <Button
                                mode="tertiary"
                                onClick={async () => {
                                    if (mode === 'online') {
                                        await leaveOnlineRoom();
                                    }

                                    setMode('menu');
                                }}
                            >
                                Выбор режима
                            </Button>
                        )}
                    </div>
                </Group>

                {mode === 'menu' && (
                    <Group>
                        <div
                            style={{
                                padding: '10px 24px 18px',
                                textAlign: 'center',
                                height: 540,
                                boxSizing: 'border-box',
                                overflow: 'hidden',
                            }}
                        >
                            <Title level="1" weight="2" style={{marginBottom: 4}}>
                                Выберите режим игры
                            </Title>

                            <Text style={{marginBottom: 12, opacity: 0.75}}>
                                Играйте локально, против Stockfish или онлайн с другом.
                            </Text>

                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '2fr 1fr',
                                    gap: 10,
                                    maxWidth: 960,
                                    margin: '0 auto',
                                    alignItems: 'stretch',
                                }}
                            >
                                <div style={{display: 'grid', gap: 10}}>
                                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10}}>
                                        <div style={{
                                            padding: 14,
                                            borderRadius: 20,
                                            background: 'linear-gradient(145deg, rgba(124,92,255,0.18), rgba(255,255,255,0.06))',
                                            border: '1px solid rgba(124,92,255,0.35)'
                                        }}>
                                            <Title level="2" weight="2" style={{marginBottom: 8}}>Два игрока</Title>
                                            <Text style={{marginBottom: 14, opacity: 0.75}}>Классическая партия на одном
                                                устройстве.</Text>
                                            <Button stretched size="l" onClick={startLocalGame}>Начать партию</Button>
                                        </div>

                                        <div style={{
                                            padding: 14,
                                            borderRadius: 20,
                                            background: 'linear-gradient(145deg, rgba(64,156,255,0.18), rgba(255,255,255,0.06))',
                                            border: '1px solid rgba(64,156,255,0.32)'
                                        }}>
                                            <Title level="2" weight="2" style={{marginBottom: 8}}>Против
                                                компьютера</Title>
                                            <Text style={{marginBottom: 14, opacity: 0.75}}>Тренируйтесь против
                                                Stockfish.</Text>

                                            <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                                                <Button stretched size="l" mode="secondary"
                                                        onClick={() => startBotGame('easy')}>Лёгкий</Button>
                                                <Button stretched size="l" mode="secondary"
                                                        onClick={() => startBotGame('medium')}>Средний</Button>
                                                <Button stretched size="l" mode="secondary"
                                                        onClick={() => startBotGame('hard')}>Сложный</Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{
                                        padding: 14,
                                        borderRadius: 20,
                                        background: 'linear-gradient(145deg, rgba(46,213,115,0.18), rgba(255,255,255,0.06))',
                                        border: '1px solid rgba(46,213,115,0.32)'
                                    }}>
                                        <Title level="2" weight="2" style={{marginBottom: 8}}>Онлайн с другом</Title>
                                        <Text style={{marginBottom: 14, opacity: 0.75}}>Создайте комнату или
                                            подключитесь по коду.</Text>

                                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
                                            <Button stretched size="l" onClick={handleCreateOnlineRoom}
                                                    disabled={onlineLoading}>
                                                Создать комнату
                                            </Button>

                                            <div style={{display: 'grid', gap: 8}}>
                                                <Input
                                                    value={roomCodeInput}
                                                    onChange={(event) => setRoomCodeInput(event.target.value)}
                                                    placeholder="Код комнаты"
                                                />

                                                <Button stretched size="l" mode="secondary"
                                                        onClick={handleJoinOnlineRoom} disabled={onlineLoading}>
                                                    Войти по коду
                                                </Button>
                                            </div>
                                        </div>

                                        {onlineError &&
                                            <Text style={{color: '#ff6b6b', marginTop: 12}}>{onlineError}</Text>}
                                    </div>
                                </div>

                                <div style={{
                                    padding: 14,
                                    borderRadius: 20,
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    textAlign: 'left',
                                    minHeight: 0,
                                }}>
                                    <Title level="3" weight="2" style={{marginBottom: 12}}>
                                        История партий
                                    </Title>

                                    {onlineHistory.length === 0 ? (
                                        <Text style={{opacity: 0.7}}>Пока нет партий.</Text>
                                    ) : (
                                        <div
                                            style={{
                                                display: 'grid',
                                                gap: 8,
                                                maxHeight: 330,
                                                overflowY: 'auto',
                                                paddingRight: 8,
                                            }}
                                        >
                                            {onlineHistory.map((item) => (
                                                <Button
                                                    key={item.code}
                                                    size="s"
                                                    mode="secondary"
                                                    onClick={() => void handleOpenHistoryRoom(item.code)}
                                                >
                                                    {item.code} — {item.status === 'FINISHED' ? 'завершена' : 'продолжить'}
                                                </Button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Group>
                )}

                {mode !== 'menu' && (
                    <div
                        style={{
                            height: 540,
                            boxSizing: 'border-box',
                            overflow: 'hidden',
                            display: 'grid',
                            gridTemplateColumns: isGameWideLayout ? 'minmax(0, 1fr) 360px' : '1fr',
                            gap: 16,
                            alignItems: 'stretch',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: isGameWideLayout ? 'center' : 'flex-start',
                                justifyContent: 'center',
                                minHeight: 0,
                            }}
                        >
                            <div style={{ width: boardWidth, maxWidth: '100%' }}>
                                <Chessboard
                                    options={{
                                        position: game.fen(),
                                        boardOrientation:
                                            mode === 'online' && playerColor === 'b' ? 'black' : 'white',
                                        allowDragging:
                                            !botThinking &&
                                            !(mode === 'bot' && game.turn() === 'b') &&
                                            !(mode === 'online' && !isMyOnlineTurn),
                                        onPieceDrop: handlePieceDrop,
                                        onSquareClick: handleSquareClick,
                                        squareStyles,
                                    }}
                                />
                            </div>
                        </div>

                        <div
                            style={{
                                padding: 16,
                                borderRadius: 20,
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.12)',
                                boxSizing: 'border-box',
                                height: '100%',
                                minHeight: 0,
                            }}
                        >
                            <div
                                style={{
                                    height: '100%',
                                    overflowY: 'auto',
                                    paddingRight: 8,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 12,
                                    boxSizing: 'border-box',
                                }}
                            >
                                <Title level="2" weight="2" style={{marginBottom: 0}}>
                                    {mode === 'local'
                                        ? 'Игра вдвоём'
                                        : mode === 'bot'
                                            ? 'Игра против компьютера'
                                            : 'Онлайн-игра'}
                                </Title>

                                {mode === 'bot' && (
                                    <Text>
                                        <b>Сложность:</b>{' '}
                                        {botDifficulty === 'easy'
                                            ? 'лёгкая'
                                            : botDifficulty === 'medium'
                                                ? 'средняя'
                                                : 'сложная'}
                                    </Text>
                                )}

                                {mode === 'online' && room && (
                                    <div style={{display: 'grid', gap: 8}}>
                                        <Text>
                                            <b>Код комнаты:</b> {room.code}
                                        </Text>

                                        <Button size="s" mode="secondary" onClick={() => void copyRoomCode()}>
                                            Скопировать код
                                        </Button>

                                        <Text>
                                            <b>Ваш цвет:</b>{' '}
                                            {playerColor === 'w' ? 'белые' : playerColor === 'b' ? 'чёрные' : 'наблюдатель'}
                                        </Text>

                                        <Text>
                                            <b>Статус комнаты:</b>{' '}
                                            {room.status === 'WAITING'
                                                ? 'ожидание второго игрока'
                                                : room.status === 'ACTIVE'
                                                    ? 'игра активна'
                                                    : 'игра завершена'}
                                        </Text>

                                        <Text>
                                            <b>Статус соперника:</b>{' '}
                                            {playerColor === 'w'
                                                ? room.blackOnline
                                                    ? 'в сети'
                                                    : 'не в сети'
                                                : playerColor === 'b'
                                                    ? room.whiteOnline
                                                        ? 'в сети'
                                                        : 'не в сети'
                                                    : 'неизвестно'}
                                        </Text>

                                        {room.status === 'FINISHED' && (
                                            <Text>
                                                <b>Результат:</b>{' '}
                                                {room.finishReason}
                                                {room.winnerColor
                                                    ? `, победили ${room.winnerColor === 'w' ? 'белые' : 'чёрные'}`
                                                    : ''}
                                            </Text>
                                        )}
                                    </div>
                                )}

                                <Text>
                                    <b>Статус:</b> {statusText}
                                </Text>

                                <div
                                    style={{
                                        display: 'grid',
                                        gap: 10,
                                        marginTop: 'auto',
                                    }}
                                >
                                    <Button
                                        stretched
                                        size="l"
                                        onClick={undoMove}
                                        disabled={fenHistory.length === 0 || botThinking || mode === 'online'}
                                    >
                                        Отменить ход
                                    </Button>

                                    <Button
                                        stretched
                                        size="l"
                                        mode="secondary"
                                        onClick={resetGame}
                                        disabled={mode === 'online'}
                                    >
                                        Новая партия
                                    </Button>

                                    {mode === 'online' && (
                                        <Button
                                            stretched
                                            size="l"
                                            appearance="negative"
                                            mode="secondary"
                                            onClick={async () => {
                                                await leaveOnlineRoom();
                                                setMode('menu');
                                            }}
                                        >
                                            Покинуть комнату
                                        </Button>
                                    )}

                                    {mode === 'online' && room?.status === 'ACTIVE' && (
                                        <Button
                                            stretched
                                            size="l"
                                            appearance="negative"
                                            mode="secondary"
                                            onClick={() => void handleResign()}
                                        >
                                            Сдаться
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Panel>
    );
};
