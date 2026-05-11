export type TacticScenario = {
    id: string;
    type: 'tactic';
    title: string;
    description: string;
    fen: string;
    correctMove: {
        from: string;
        to: string;
    };
    hint: string;
    explanation: string;
    theme: string;
};

export type OpeningMove = {
    moveNumber: number;
    side: 'white' | 'black';
    pieceName: string;
    from: string;
    to: string;
    notation: string;
    explanation: string;
};

export type OpeningScenario = {
    id: string;
    type: 'opening';
    title: string;
    description: string;
    startingFen?: string;
    openingName: string;
    moves: OpeningMove[];
    resultDescription: string;
};

export type TrainingScenario = TacticScenario | OpeningScenario;