import { Client } from '@stomp/stompjs';
import type { RoomResponse } from './onlineGameApi';

export type OnlineMoveRequest = {
    playerId: string;
    from: string;
    to: string;
    promotion?: string;
    fenAfter: string;
};

const WS_URL = 'wss://vk-chess-backend.onrender.com/ws/game';

export const createOnlineGameSocket = (
    roomCode: string,
    onRoomUpdate: (room: RoomResponse) => void,
) => {
    const client = new Client({
        brokerURL: WS_URL,
        reconnectDelay: 1000,
        debug: () => undefined,
        onConnect: () => {
            client.subscribe(`/topic/rooms/${roomCode}`, (message) => {
                const room = JSON.parse(message.body) as RoomResponse;
                onRoomUpdate(room);
            });
        },
    });

    client.activate();

    return {
        sendMove: (move: OnlineMoveRequest) => {
            client.publish({
                destination: `/app/rooms/${roomCode}/move`,
                body: JSON.stringify(move),
            });
        },

        disconnect: () => {
            void client.deactivate();
        },
    };
};