import type { OpeningScenario } from '../types';

export const ruyLopez: OpeningScenario = {
    id: 'opening-ruy-lopez',
    type: 'opening',
    title: 'Испанская партия',
    description: 'Изучите один из классических вариантов испанской партии на 15 ходов.',
    openingName: 'Испанская партия',
    moves: [
        { moveNumber: 1, side: 'white', pieceName: 'пешка', from: 'e2', to: 'e4', notation: '1. e4', explanation: 'Белые занимают центр и открывают линии для ферзя и слона.' },
        { moveNumber: 1, side: 'black', pieceName: 'пешка', from: 'e7', to: 'e5', notation: '... e5', explanation: 'Чёрные симметрично занимают центр и освобождают фигуры для развития.' },

        { moveNumber: 2, side: 'white', pieceName: 'конь', from: 'g1', to: 'f3', notation: '2. Кf3', explanation: 'Белые развивают коня и атакуют пешку e5.' },
        { moveNumber: 2, side: 'black', pieceName: 'конь', from: 'b8', to: 'c6', notation: '... Кc6', explanation: 'Чёрные защищают пешку e5 и развивают коня.' },

        { moveNumber: 3, side: 'white', pieceName: 'слон', from: 'f1', to: 'b5', notation: '3. Сb5', explanation: 'Белые создают давление на коня c6, который защищает пешку e5.' },
        { moveNumber: 3, side: 'black', pieceName: 'слон', from: 'f8', to: 'c5', notation: '... Сc5', explanation: 'Чёрные активно развивают слона и усиливают контроль центра.' },

        { moveNumber: 4, side: 'white', pieceName: 'пешка', from: 'c2', to: 'c3', notation: '4. c3', explanation: 'Белые готовят продвижение d4 и построение сильного пешечного центра.' },
        { moveNumber: 4, side: 'black', pieceName: 'конь', from: 'g8', to: 'f6', notation: '... Кf6', explanation: 'Чёрные развивают коня и атакуют пешку e4.' },

        { moveNumber: 5, side: 'white', pieceName: 'пешка', from: 'd2', to: 'd4', notation: '5. d4', explanation: 'Белые занимают центр и атакуют слона c5.' },
        { moveNumber: 5, side: 'black', pieceName: 'пешка', from: 'e5', to: 'd4', notation: '... exd4', explanation: 'Чёрные снимают напряжение в центре и забирают пешку d4.' },

        { moveNumber: 6, side: 'white', pieceName: 'пешка', from: 'e4', to: 'e5', notation: '6. e5', explanation: 'Белые продвигают пешку и оттесняют коня f6.' },
        { moveNumber: 6, side: 'black', pieceName: 'конь', from: 'f6', to: 'e4', notation: '... Кe4', explanation: 'Чёрные занимают активную центральную позицию конём.' },

        { moveNumber: 7, side: 'white', pieceName: 'король', from: 'e1', to: 'g1', notation: '7. O-O', explanation: 'Белые делают рокировку и уводят короля в безопасность.' },
        { moveNumber: 7, side: 'black', pieceName: 'пешка', from: 'd7', to: 'd5', notation: '... d5', explanation: 'Чёрные укрепляют центр и поддерживают активное положение фигур.' },

        { moveNumber: 8, side: 'white', pieceName: 'пешка', from: 'c3', to: 'd4', notation: '8. cxd4', explanation: 'Белые возвращают пешку и восстанавливают контроль над центром.' },
        { moveNumber: 8, side: 'black', pieceName: 'слон', from: 'c5', to: 'b6', notation: '... Сb6', explanation: 'Слон уходит из-под возможных атак и сохраняет давление на диагонали.' },

        { moveNumber: 9, side: 'white', pieceName: 'слон', from: 'c1', to: 'e3', notation: '9. Сe3', explanation: 'Белые развивают слона и укрепляют центральные поля.' },
        { moveNumber: 9, side: 'black', pieceName: 'король', from: 'e8', to: 'g8', notation: '... O-O', explanation: 'Чёрные также делают рокировку и завершают базовое развитие короля.' },

        { moveNumber: 10, side: 'white', pieceName: 'слон', from: 'b5', to: 'c6', notation: '10. Сxc6', explanation: 'Белые разменивают слона на коня, повреждая пешечную структуру чёрных.' },
        { moveNumber: 10, side: 'black', pieceName: 'пешка', from: 'b7', to: 'c6', notation: '... bxc6', explanation: 'Чёрные возвращают материал, но получают сдвоенные пешки по линии c.' },

        { moveNumber: 11, side: 'white', pieceName: 'ферзь', from: 'd1', to: 'c2', notation: '11. Фc2', explanation: 'Ферзь поддерживает центр и создаёт давление на e4 и c6.' },
        { moveNumber: 11, side: 'black', pieceName: 'пешка', from: 'f7', to: 'f5', notation: '... f5', explanation: 'Чёрные начинают активную контригру на королевском фланге.' },

        { moveNumber: 12, side: 'white', pieceName: 'ферзь', from: 'c2', to: 'c6', notation: '12. Фxc6', explanation: 'Белые забирают пешку c6 и используют слабость пешечной структуры чёрных.' },
        { moveNumber: 12, side: 'black', pieceName: 'ладья', from: 'a8', to: 'b8', notation: '... Лb8', explanation: 'Чёрные атакуют ферзя по линии b и получают темп.' },

        { moveNumber: 13, side: 'white', pieceName: 'конь', from: 'b1', to: 'c3', notation: '13. Кc3', explanation: 'Белые развивают последнюю лёгкую фигуру и усиливают контроль центра.' },
        { moveNumber: 13, side: 'black', pieceName: 'слон', from: 'c8', to: 'b7', notation: '... Сb7', explanation: 'Чёрные развивают слона на большую диагональ и атакуют ферзя.' },

        { moveNumber: 14, side: 'white', pieceName: 'ферзь', from: 'c6', to: 'a4', notation: '14. Фa4', explanation: 'Ферзь уходит из-под атаки и сохраняет активность на ферзевом фланге.' },
        { moveNumber: 14, side: 'black', pieceName: 'пешка', from: 'f5', to: 'f4', notation: '... f4', explanation: 'Чёрные продвигают пешку и начинают стеснять фигуры белых.' },

        { moveNumber: 15, side: 'white', pieceName: 'слон', from: 'e3', to: 'c1', notation: '15. Сc1', explanation: 'Белые отводят слона, сохраняя фигуру и готовя дальнейшую перестройку.' },
        { moveNumber: 15, side: 'black', pieceName: 'король', from: 'g8', to: 'h8', notation: '... Крh8', explanation: 'Чёрные уводят короля с линии возможных шахов и готовят дальнейшую атаку.' },
    ],
    resultDescription:
        'После 15 ходов возникает острая позиция: белые получили активность ферзя и давление на слабости, а чёрные развили контригру на королевском фланге.',
};