export type BotDifficulty = 'easy' | 'medium' | 'hard';

const STOCKFISH_WORKER_URL = '/stockfish/stockfish.js';

const difficultyDepth: Record<BotDifficulty, number> = {
    easy: 2,
    medium: 6,
    hard: 10,
};

let engine: Worker | null = null;
let initialized = false;

const getEngine = () => {
    if (!engine) {
        engine = new Worker(STOCKFISH_WORKER_URL);
    }

    return engine;
};

const waitForMessage = (expected: string, timeoutMs = 5000) => {
    return new Promise<void>((resolve, reject) => {
        const worker = getEngine();

        const timeout = window.setTimeout(() => {
            worker.removeEventListener('message', handler);
            reject(new Error(`Stockfish timeout: ${expected}`));
        }, timeoutMs);

        const handler = (event: MessageEvent) => {
            const message = String(event.data);

            if (message.includes(expected)) {
                window.clearTimeout(timeout);
                worker.removeEventListener('message', handler);
                resolve();
            }
        };

        worker.addEventListener('message', handler);
    });
};

const initEngine = async () => {
    if (initialized) {
        return;
    }

    const worker = getEngine();

    worker.postMessage('uci');
    await waitForMessage('uciok');

    worker.postMessage('isready');
    await waitForMessage('readyok');

    initialized = true;
};

export const getStockfishMove = async (
    fen: string,
    difficulty: BotDifficulty,
): Promise<string | null> => {
    await initEngine();

    const worker = getEngine();
    const depth = difficultyDepth[difficulty];

    return new Promise((resolve) => {
        const timeout = window.setTimeout(() => {
            worker.removeEventListener('message', handler);
            resolve(null);
        }, 10000);

        const handler = (event: MessageEvent) => {
            const message = String(event.data);

            if (!message.startsWith('bestmove')) {
                return;
            }

            window.clearTimeout(timeout);
            worker.removeEventListener('message', handler);

            const [, bestMove] = message.split(' ');
            resolve(bestMove && bestMove !== '(none)' ? bestMove : null);
        };

        worker.addEventListener('message', handler);

        worker.postMessage(`position fen ${fen}`);
        worker.postMessage(`go depth ${depth}`);
    });
};