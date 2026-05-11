import { Card, Text, Title, Button } from '@vkontakte/vkui';

export type TrainingCardProps = {
    title: string;
    description: string;
    label: string;
    onClick: () => void;
};

export const TrainingCard = ({
                                 title,
                                 description,
                                 label,
                                 onClick,
                             }: TrainingCardProps) => {
    return (
        <Card mode="shadow" style={{ minHeight: 184 }}>
            <div
                style={{
                    padding: 16,
                    minHeight: 184,
                    display: 'flex',
                    flexDirection: 'column',
                    boxSizing: 'border-box',
                }}
            >
                <Text style={{ marginBottom: 8, opacity: 0.7 }}>
                    {label}
                </Text>

                <Title level="3" weight="2" style={{ marginBottom: 8 }}>
                    {title}
                </Title>

                <Text style={{ marginBottom: 16, flex: 1 }}>
                    {description}
                </Text>

                <Button stretched size="m" onClick={onClick}>
                    Открыть
                </Button>
            </div>
        </Card>
    );
};
