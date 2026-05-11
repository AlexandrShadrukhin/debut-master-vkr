export type GameStatus = 'WAITING' | 'ACTIVE' | 'FINISHED';

export type RoomResponse = {
    code: string;
    fen: string;
    turn: 'w' | 'b';
    status: GameStatus;
    whitePlayerId: string | null;
    blackPlayerId: string | null;
    whiteOnline: boolean;
    blackOnline: boolean;
    winnerColor: 'w' | 'b' | null;
    finishReason: string | null;
};

const API_URL = 'https://vk-chess-backend.onrender.com';

export const createRoom = async (playerId: string): Promise<RoomResponse> => {
    const response = await fetch(`${API_URL}/api/rooms`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId }),
    });

    if (!response.ok) {
        throw new Error('Не удалось создать комнату');
    }

    return response.json();
};

export const joinRoom = async (
    code: string,
    playerId: string,
): Promise<RoomResponse> => {
    const response = await fetch(`${API_URL}/api/rooms/${code}/join`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId }),
    });

    if (!response.ok) {
        throw new Error('Не удалось подключиться к комнате');
    }

    return response.json();
};

export const getRoom = async (code: string): Promise<RoomResponse> => {
    const response = await fetch(`${API_URL}/api/rooms/${code}`);

    if (!response.ok) {
        throw new Error('Комната не найдена');
    }

    return response.json();
};

export const leaveRoom = async (
    code: string,
    playerId: string,
): Promise<RoomResponse> => {
    const response = await fetch(`${API_URL}/api/rooms/${code}/leave`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId }),
    });

    if (!response.ok) {
        throw new Error('Не удалось выйти из комнаты');
    }

    return response.json();
};

export const finishRoom = async (
    code: string,
    playerId: string,
    winnerColor: 'w' | 'b' | null,
    reason: string,
): Promise<RoomResponse> => {
    const response = await fetch(`${API_URL}/api/rooms/${code}/finish`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId, winnerColor, reason }),
    });

    if (!response.ok) {
        throw new Error('Не удалось завершить партию');
    }

    return response.json();
};

export const getPlayerRooms = async (
    playerId: string,
): Promise<RoomResponse[]> => {
    const response = await fetch(`${API_URL}/api/rooms/player/${playerId}`);

    if (!response.ok) {
        throw new Error('Не удалось получить историю партий');
    }

    return response.json();
};