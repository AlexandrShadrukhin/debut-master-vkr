import { SplitLayout, SplitCol, View } from '@vkontakte/vkui';
import { useActiveVkuiLocation } from '@vkontakte/vk-mini-apps-router';

import { Home, Game, Learning, Progress } from './panels';
import { DEFAULT_VIEW_PANELS } from './routes';

export const App = () => {
    const { panel = DEFAULT_VIEW_PANELS.HOME } = useActiveVkuiLocation();

    return (
        <SplitLayout>
            <SplitCol>
                <View activePanel={panel}>
                    <Home id={DEFAULT_VIEW_PANELS.HOME} />
                    <Game id={DEFAULT_VIEW_PANELS.GAME} />
                    <Learning id={DEFAULT_VIEW_PANELS.LEARNING} />
                    <Progress id={DEFAULT_VIEW_PANELS.PROGRESS} />
                </View>
            </SplitCol>
        </SplitLayout>
    );
};