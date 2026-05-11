import type { OpeningScenario } from '../types';

export const frenchDefense: OpeningScenario = {
    id: 'opening-french-defense',
    type: 'opening',
    title: 'Французская защита',
    description: 'Полуоткрытое начало после 1.e4 e6 с последующей борьбой за центр.',
    openingName: 'Французская защита',
    moves: [
        { moveNumber: 1, side: 'white', pieceName: 'пешка', from: 'e2', to: 'e4', notation: '1. e4', explanation: 'Белые занимают центр.' },
        { moveNumber: 1, side: 'black', pieceName: 'пешка', from: 'e7', to: 'e6', notation: '... e6', explanation: 'Чёрные подготавливают d5 и укрепляют пункт f7.' },

        { moveNumber: 2, side: 'white', pieceName: 'пешка', from: 'd2', to: 'd4', notation: '2. d4', explanation: 'Белые захватывают центр.' },
        { moveNumber: 2, side: 'black', pieceName: 'пешка', from: 'd7', to: 'd5', notation: '... d5', explanation: 'Чёрные сразу атакуют центр белых.' },

        { moveNumber: 3, side: 'white', pieceName: 'конь', from: 'b1', to: 'c3', notation: '3. Кc3', explanation: 'Белые развивают фигуру и поддерживают пешку e4.' },
        { moveNumber: 3, side: 'black', pieceName: 'слон', from: 'f8', to: 'b4', notation: '... Сb4', explanation: 'Чёрные создают давление на центр и фигуры белых.' },

        { moveNumber: 4, side: 'white', pieceName: 'пешка', from: 'e4', to: 'e5', notation: '4. e5', explanation: 'Белые продвигают пешку и ограничивают коня g8.' },
        { moveNumber: 4, side: 'black', pieceName: 'пешка', from: 'c7', to: 'c5', notation: '... c5', explanation: 'Чёрные подрывают центр.' },

        { moveNumber: 5, side: 'white', pieceName: 'пешка', from: 'a2', to: 'a3', notation: '5. a3', explanation: 'Белые вынуждают слона определиться.' },
        { moveNumber: 5, side: 'black', pieceName: 'слон', from: 'b4', to: 'c3', notation: '... Сxc3+', explanation: 'Чёрные меняют слона на коня.' },

        { moveNumber: 6, side: 'white', pieceName: 'пешка', from: 'b2', to: 'c3', notation: '6. bxc3', explanation: 'Белые берут фигуру и получают пешечный центр.' },
        { moveNumber: 6, side: 'black', pieceName: 'конь', from: 'g8', to: 'e7', notation: '... Кe7', explanation: 'Чёрные готовят развитие и рокировку.' },

        { moveNumber: 7, side: 'white', pieceName: 'ферзь', from: 'd1', to: 'g4', notation: '7. Фg4', explanation: 'Белые атакуют пункт g7.' },
        { moveNumber: 7, side: 'black', pieceName: 'король', from: 'e8', to: 'g8', notation: '... O-O', explanation: 'Чёрные рокируют.' },

        { moveNumber: 8, side: 'white', pieceName: 'слон', from: 'f1', to: 'd3', notation: '8. Сd3', explanation: 'Белые развивают слона и усиливают давление.' },
        { moveNumber: 8, side: 'black', pieceName: 'конь', from: 'b8', to: 'c6', notation: '... Кbc6', explanation: 'Чёрные развивают фигуру и усиливают центр.' },

        { moveNumber: 9, side: 'white', pieceName: 'ферзь', from: 'g4', to: 'h5', notation: '9. Фh5', explanation: 'Белые сохраняют давление на королевском фланге.' },
        { moveNumber: 9, side: 'black', pieceName: 'конь', from: 'e7', to: 'g6', notation: '... Кg6', explanation: 'Чёрные защищают поля вокруг короля.' },

        { moveNumber: 10, side: 'white', pieceName: 'конь', from: 'g1', to: 'f3', notation: '10. Кf3', explanation: 'Белые развивают фигуру и готовят атаку.' },
        { moveNumber: 10, side: 'black', pieceName: 'ферзь', from: 'd8', to: 'c7', notation: '... Фc7', explanation: 'Чёрные защищают пешку и готовят развитие.' },

        { moveNumber: 11, side: 'white', pieceName: 'слон', from: 'c1', to: 'e3', notation: '11. Сe3', explanation: 'Белые завершают развитие лёгких фигур.' },
        { moveNumber: 11, side: 'black', pieceName: 'пешка', from: 'c5', to: 'c4', notation: '... c4', explanation: 'Чёрные фиксируют структуру и ограничивают слона.' },

        { moveNumber: 12, side: 'white', pieceName: 'слон', from: 'd3', to: 'g6', notation: '12. Сxg6', explanation: 'Белые вскрывают королевский фланг.' },
        { moveNumber: 12, side: 'black', pieceName: 'пешка', from: 'f7', to: 'g6', notation: '... fxg6', explanation: 'Чёрные берут слона.' },

        { moveNumber: 13, side: 'white', pieceName: 'ферзь', from: 'h5', to: 'g4', notation: '13. Фg4', explanation: 'Белые продолжают атаку.' },
        { moveNumber: 13, side: 'black', pieceName: 'ферзь', from: 'c7', to: 'f7', notation: '... Фf7', explanation: 'Чёрные усиливают защиту.' },

        { moveNumber: 14, side: 'white', pieceName: 'конь', from: 'f3', to: 'g5', notation: '14. Кg5', explanation: 'Белые усиливают давление на короля.' },
        { moveNumber: 14, side: 'black', pieceName: 'ферзь', from: 'f7', to: 'e8', notation: '... Фe8', explanation: 'Чёрные защищают ключевые поля.' },

        { moveNumber: 15, side: 'white', pieceName: 'пешка', from: 'h2', to: 'h4', notation: '15. h4', explanation: 'Белые усиливают атаку на королевском фланге.' },
    ],
    resultDescription:
        'Возникает сложная позиция с активной игрой: белые атакуют короля, чёрные защищаются и ищут контригру.',
};