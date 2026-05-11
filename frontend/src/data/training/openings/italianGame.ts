import type { OpeningScenario } from '../types';

export const italianGame: OpeningScenario = {
    id: 'opening-italian',
    type: 'opening',
    title: 'Итальянская партия',
    description: 'Изучите спокойный вариант итальянской партии с развитием фигур, рокировкой и профилактическими ходами.',
    openingName: 'Итальянская партия',
    moves: [
        { moveNumber: 1, side: 'white', pieceName: 'пешка', from: 'e2', to: 'e4', notation: '1. e4', explanation: 'Белые занимают центр и открывают линии для ферзя и слона.' },
        { moveNumber: 1, side: 'black', pieceName: 'пешка', from: 'e7', to: 'e5', notation: '... e5', explanation: 'Чёрные симметрично борются за центр.' },

        { moveNumber: 2, side: 'white', pieceName: 'конь', from: 'g1', to: 'f3', notation: '2. Кf3', explanation: 'Белые развивают коня и атакуют пешку e5.' },
        { moveNumber: 2, side: 'black', pieceName: 'конь', from: 'b8', to: 'c6', notation: '... Кc6', explanation: 'Чёрные защищают пешку e5 и развивают фигуру.' },

        { moveNumber: 3, side: 'white', pieceName: 'слон', from: 'f1', to: 'c4', notation: '3. Сc4', explanation: 'Белые выводят слона на активную диагональ и создают давление на пункт f7.' },
        { moveNumber: 3, side: 'black', pieceName: 'слон', from: 'f8', to: 'c5', notation: '... Сc5', explanation: 'Чёрные также активно развивают слона и контролируют центральные поля.' },

        { moveNumber: 4, side: 'white', pieceName: 'пешка', from: 'c2', to: 'c3', notation: '4. c3', explanation: 'Белые готовят построение центра ходом d4 и ограничивают активность чёрных фигур.' },
        { moveNumber: 4, side: 'black', pieceName: 'конь', from: 'g8', to: 'f6', notation: '... Кf6', explanation: 'Чёрные развивают коня и нападают на пешку e4.' },

        { moveNumber: 5, side: 'white', pieceName: 'пешка', from: 'd2', to: 'd3', notation: '5. d3', explanation: 'Белые защищают пешку e4 и укрепляют центр.' },
        { moveNumber: 5, side: 'black', pieceName: 'пешка', from: 'd7', to: 'd6', notation: '... d6', explanation: 'Чёрные подкрепляют пешку e5 и создают устойчивую центральную структуру.' },

        { moveNumber: 6, side: 'white', pieceName: 'король', from: 'e1', to: 'g1', notation: '6. O-O', explanation: 'Белые делают рокировку и обеспечивают безопасность короля.' },
        { moveNumber: 6, side: 'black', pieceName: 'король', from: 'e8', to: 'g8', notation: '... O-O', explanation: 'Чёрные также рокируют и завершают базовую безопасность короля.' },

        { moveNumber: 7, side: 'white', pieceName: 'слон', from: 'c4', to: 'b3', notation: '7. Сb3', explanation: 'Профилактический ход: слон уходит от возможных атак пешками d5 или b5 и сохраняет давление по диагонали.' },
        { moveNumber: 7, side: 'black', pieceName: 'пешка', from: 'a7', to: 'a6', notation: '... a6', explanation: 'Чёрные готовят удобное отступление слона на a7 и ограничивают фигуры белых на ферзевом фланге.' },

        { moveNumber: 8, side: 'white', pieceName: 'конь', from: 'b1', to: 'd2', notation: '8. Кbd2', explanation: 'Белые развивают второго коня. В дальнейшем он может перейти через f1 на g3.' },
        { moveNumber: 8, side: 'black', pieceName: 'слон', from: 'c5', to: 'a7', notation: '... Сa7', explanation: 'Чёрные переводят слона на спокойную стоянку, сохраняя активность по диагонали.' },

        { moveNumber: 9, side: 'white', pieceName: 'пешка', from: 'h2', to: 'h3', notation: '9. h3', explanation: 'Белые не дают чёрному слону или коню занять g4 и связать коня f3.' },
        { moveNumber: 9, side: 'black', pieceName: 'пешка', from: 'h7', to: 'h6', notation: '... h6', explanation: 'Чёрные делают аналогичный профилактический ход и контролируют поле g5.' },

        { moveNumber: 10, side: 'white', pieceName: 'ладья', from: 'f1', to: 'e1', notation: '10. Лe1', explanation: 'Белые подкрепляют пешку e4 и освобождают поле f1 для возможного перевода коня.' },
        { moveNumber: 10, side: 'black', pieceName: 'слон', from: 'c8', to: 'e6', notation: '... Сe6', explanation: 'Чёрные развивают последнюю лёгкую фигуру и предлагают размен слонов.' },

        { moveNumber: 11, side: 'white', pieceName: 'конь', from: 'd2', to: 'f1', notation: '11. Кf1', explanation: 'Белые начинают типовой манёвр коня: через f1 он может попасть на g3 или e3.' },
        { moveNumber: 11, side: 'black', pieceName: 'ладья', from: 'f8', to: 'e8', notation: '... Лe8', explanation: 'Чёрные усиливают давление по линии e и поддерживают центральную пешку.' },

        { moveNumber: 12, side: 'white', pieceName: 'слон', from: 'b3', to: 'e6', notation: '12. Сxe6', explanation: 'Белые выбирают одну из главных идей позиции — разменивают активного слона чёрных.' },
    ],
    resultDescription:
        'В данной структуре белые получили безопасного короля, устойчивый центр и план перевода коня через f1. Чёрные развили фигуры, укрепили центр и подготовили контригру по линии e.',
};