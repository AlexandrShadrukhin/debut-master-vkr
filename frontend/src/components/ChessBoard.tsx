import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Chess, Square } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { Button, Group, Text } from '@vkontakte/vkui';

type PieceDropArgs = {
    piece: unknown;
    sourceSquare: string;
    targetSquare: string | null;
};

type SquareClickArgs = {
    piece: unknown | null;
    square: string;
};

export type ChessBoardProps = {
    initialFen?: string;
    title?: string;
    description?: string;
    readOnly?: boolean;
    onMoveSuccess?: (from: string, to: string, fen: string, isExpectedMove?: boolean) => void;
    validateMove?: (from: string, to: string) => boolean;
    onUndoOverride?: () => void;
    onResetOverride?: () => void;
    disableUndo?: boolean;
    topOverlay?: string;
    bottomOverlay?: string;
    showDebugInfo?: boolean;
    maxBoardWidth?: number;
    reservedHeightOverride?: number;
    hideInfoPanel?: boolean;
};

export const ChessBoard = ({
                               initialFen,
                               title,
                               description,
                               readOnly = false,
                               onMoveSuccess,
                               validateMove,
                               onUndoOverride,
                               onResetOverride,
                               disableUndo = false,
                               topOverlay,
                               bottomOverlay,
                               showDebugInfo = false,
                               maxBoardWidth = 520,
                               reservedHeightOverride,
                               hideInfoPanel = false,
                           }: ChessBoardProps) => {
    const [game, setGame] = useState(() => new Chess(initialFen));
    const [boardWidth, setBoardWidth] = useState(320);
    const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
    const [fenHistory, setFenHistory] = useState<string[]>([]);

    useEffect(() => {
        setGame(new Chess(initialFen));
        setSelectedSquare(null);
        setFenHistory([]);
    }, [initialFen]);

    useEffect(() => {
        const updateBoardWidth = () => {
            const isDesktop = window.innerWidth >= 768;

            const horizontalPadding = isDesktop ? 96 : 32;
            const reservedHeight = reservedHeightOverride ?? (isDesktop ? 430 : 300);

            const maxByWidth = window.innerWidth - horizontalPadding;
            const maxByHeight = window.innerHeight - reservedHeight;

            const nextSize = Math.min(maxByWidth, maxByHeight, maxBoardWidth);

            setBoardWidth(Math.max(220, nextSize));
        };

        updateBoardWidth();
        window.addEventListener('resize', updateBoardWidth);

        return () => window.removeEventListener('resize', updateBoardWidth);
    }, [maxBoardWidth, reservedHeightOverride]);

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

    const statusText = useMemo(() => {
        if (game.isCheckmate()) {
            return game.turn() === 'w'
                ? 'Мат. Победили чёрные.'
                : 'Мат. Победили белые.';
        }

        if (game.isDraw()) {
            return 'Ничья.';
        }

        const turnText = game.turn() === 'w' ? 'Ход белых' : 'Ход чёрных';
        const checkText = game.isCheck() ? ' Шах.' : '';

        return `${turnText}.${checkText}`;
    }, [game]);

    const tryMove = (from: Square, to: Square) => {
        try {
            const isExpectedMove = validateMove ? validateMove(from, to) : true;

            const currentFen = game.fen();
            const gameCopy = new Chess(currentFen);

            const move = gameCopy.move({
                from,
                to,
                promotion: 'q',
            });

            if (!move) {
                return false;
            }

            setFenHistory((prev) => [...prev, currentFen]);
            setGame(gameCopy);
            onMoveSuccess?.(from, to, gameCopy.fen(), isExpectedMove);
            return true;
        } catch {
            return false;
        }
    };

    const handlePieceDrop = ({ sourceSquare, targetSquare }: PieceDropArgs) => {
        if (readOnly || !targetSquare) {
            return false;
        }

        const moved = tryMove(sourceSquare as Square, targetSquare as Square);

        if (moved) {
            setSelectedSquare(null);
        }

        return moved;
    };

    const handleSquareClick = ({ square }: SquareClickArgs) => {
        if (readOnly) {
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

            setSelectedSquare(clickedSquare);
            return;
        }

        if (selectedSquare === clickedSquare) {
            setSelectedSquare(null);
            return;
        }

        if (clickedPiece && clickedPiece.color === game.turn()) {
            setSelectedSquare(clickedSquare);
            return;
        }

        const moved = tryMove(selectedSquare, clickedSquare);

        if (moved) {
            setSelectedSquare(null);
        }
    };

    const handleUndo = () => {
        if (onUndoOverride) {
            onUndoOverride();
            setSelectedSquare(null);
            return;
        }

        if (fenHistory.length === 0) {
            return;
        }

        const previousFen = fenHistory[fenHistory.length - 1];
        setGame(new Chess(previousFen));
        setFenHistory((prev) => prev.slice(0, -1));
        setSelectedSquare(null);
    };

    const handleReset = () => {
        if (onResetOverride) {
            onResetOverride();
            setSelectedSquare(null);
            return;
        }

        setGame(new Chess(initialFen));
        setSelectedSquare(null);
        setFenHistory([]);
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

    return (
        <div>
            {(title || description) && (
                <Group>
                    <div style={{ padding: 16 }}>
                        {title && (
                            <Text style={{ marginBottom: 8 }}>
                                <b>{title}</b>
                            </Text>
                        )}
                        {description && <Text>{description}</Text>}
                    </div>
                </Group>
            )}

            <div style={{ padding: '8px 16px', display: 'flex', justifyContent: 'center' }}>
                <div
                    style={{
                        width: boardWidth,
                        maxWidth: '100%',
                        position: 'relative',
                        borderRadius: 16,
                        overflow: 'hidden',
                        boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
                    }}
                >
                    {topOverlay && (
                        <div
                            style={{
                                position: 'absolute',
                                top: 10,
                                left: 10,
                                right: 10,
                                zIndex: 5,
                                padding: '10px 12px',
                                borderRadius: 12,
                                background: 'rgba(20, 20, 20, 0.72)',
                                backdropFilter: 'blur(8px)',
                                color: '#fff',
                                fontWeight: 600,
                                lineHeight: 1.35,
                            }}
                        >
                            {topOverlay}
                        </div>
                    )}

                    {bottomOverlay && (
                        <div
                            style={{
                                position: 'absolute',
                                bottom: 10,
                                left: 10,
                                right: 10,
                                zIndex: 5,
                                padding: '10px 12px',
                                borderRadius: 12,
                                background: 'rgba(20, 20, 20, 0.72)',
                                backdropFilter: 'blur(8px)',
                                color: '#fff',
                                fontWeight: 600,
                                lineHeight: 1.35,
                            }}
                        >
                            {bottomOverlay}
                        </div>
                    )}

                    <Chessboard
                        options={{
                            position: game.fen(),
                            allowDragging: !readOnly,
                            onPieceDrop: handlePieceDrop,
                            onSquareClick: handleSquareClick,
                            squareStyles,
                        }}
                    />
                </div>
            </div>

            {!hideInfoPanel && (
                <Group>
                    <div style={{ padding: 16 }}>
                        {!showDebugInfo && (
                            <Text style={{ marginBottom: 12 }}>
                                <b>Статус:</b> {statusText}
                            </Text>
                        )}

                        {showDebugInfo && (
                            <>
                                <Text style={{ marginBottom: 12 }}>
                                    <b>Статус:</b> {statusText}
                                </Text>

                                <Text style={{ marginBottom: 12 }}>
                                    <b>Выбрана клетка:</b> {selectedSquare ?? 'нет'}
                                </Text>

                                <Text style={{ marginBottom: 12, wordBreak: 'break-word' }}>
                                    <b>FEN:</b> {game.fen()}
                                </Text>
                            </>
                        )}

                        {!readOnly && (
                            <div style={{ display: 'flex', gap: 12 }}>
                                <Button size="l" stretched onClick={handleUndo} disabled={disableUndo}>
                                    Отменить ход
                                </Button>
                                <Button size="l" stretched mode="secondary" onClick={handleReset}>
                                    Сбросить
                                </Button>
                            </div>
                        )}
                    </div>
                </Group>
            )}
        </div>
    );
};
