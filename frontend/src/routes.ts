import {
    createHashRouter,
    createPanel,
    createRoot,
    createView,
    RoutesConfig,
} from '@vkontakte/vk-mini-apps-router';

export const DEFAULT_ROOT = 'default_root';
export const DEFAULT_VIEW = 'default_view';

export const DEFAULT_VIEW_PANELS = {
    HOME: 'home',
    GAME: 'game',
    LEARNING: 'learning',
    PROGRESS: 'progress',
} as const;

export const routes = RoutesConfig.create([
    createRoot(DEFAULT_ROOT, [
        createView(DEFAULT_VIEW, [
            createPanel(DEFAULT_VIEW_PANELS.HOME, '/'),
            createPanel(DEFAULT_VIEW_PANELS.GAME, '/game'),
            createPanel(DEFAULT_VIEW_PANELS.LEARNING, '/learning'),
            createPanel(DEFAULT_VIEW_PANELS.PROGRESS, '/progress'),
        ]),
    ]),
]);

export const router = createHashRouter(routes.getRoutes());