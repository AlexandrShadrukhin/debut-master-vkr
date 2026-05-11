import { Button, Group, Panel, PanelHeader, Placeholder, Text, Title } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';

export type HomeProps = {
    id: string;
};

export const Home = ({ id }: HomeProps) => {
    const routeNavigator = useRouteNavigator();

    return (
        <Panel id={id}>
            <PanelHeader>Шахматы VK</PanelHeader>

            <Group>
                <Placeholder>
                    <Title level="1" weight="1" style={{ marginBottom: 8 }}>
                        Шахматы с обучающими сценариями
                    </Title>
                    <Text>Выберите режим работы приложения</Text>
                </Placeholder>
            </Group>

            <Group>
                <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <Button size="l" stretched onClick={() => routeNavigator.push('/game')}>
                        Играть
                    </Button>

                    <Button
                        size="l"
                        stretched
                        mode="secondary"
                        onClick={() => routeNavigator.push('/learning')}
                    >
                        Обучающие сценарии
                    </Button>

                    <Button
                        size="l"
                        stretched
                        mode="tertiary"
                        onClick={() => routeNavigator.push('/progress')}
                    >
                        Прогресс
                    </Button>
                </div>
            </Group>
        </Panel>
    );
};