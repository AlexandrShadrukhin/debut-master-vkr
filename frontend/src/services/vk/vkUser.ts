import bridge from '@vkontakte/vk-bridge';

const PLAYER_ID_KEY = 'vk_chess_player_id';

const getFallbackPlayerId = () => {
    const existing = localStorage.getItem(PLAYER_ID_KEY);

    if (existing) {
        return existing;
    }

    const fallback = `player-${crypto.randomUUID()}`;
    localStorage.setItem(PLAYER_ID_KEY, fallback);

    return fallback;
};

export const getAppPlayerId = async () => {
    try {
        const user = await Promise.race([
            bridge.send('VKWebAppGetUserInfo'),
            new Promise<never>((_, reject) =>
                window.setTimeout(() => reject(new Error('VK Bridge timeout')), 1500),
            ),
        ]);

        const playerId = `vk_${user.id}`;
        localStorage.setItem(PLAYER_ID_KEY, playerId);

        return playerId;
    } catch {
        return getFallbackPlayerId();
    }
};

export const getCachedPlayerId = () => {
    return getFallbackPlayerId();
};