import { Button, Text, Title } from '@vkontakte/vkui';
import type { ReactNode } from 'react';

type GameModeCardProps = {
    title: string;
    description: string;
    buttonText?: string;
    onClick?: () => void;
    children?: ReactNode;
};

export const GameModeCard = ({
                                 title,
                                 description,
                                 buttonText,
                                 onClick,
                                 children,
                             }: GameModeCardProps) => {
    return (
        <div
            style={{
                padding: 20,
                borderRadius: 20,
                background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))',
                border: '1px solid rgba(255,255,255,0.08)',
                minHeight: 190,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 16,
            }}
        >
            <div>
                <Title level="3" weight="2" style={{ marginBottom: 8 }}>
                    {title}
                </Title>

                <Text style={{ opacity: 0.75 }}>
                    {description}
                </Text>
            </div>

            {children}

            {buttonText && onClick && (
                <Button stretched size="l" onClick={onClick}>
                    {buttonText}
                </Button>
            )}
        </div>
    );
};