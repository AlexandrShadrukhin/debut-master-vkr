import type { OpeningScenario } from '../types';

export const grobOpening: OpeningScenario = {
    id: 'opening-grob',
    type: 'opening',
    title: 'Дебют Гроба',
    description:
        'Дебют Гроба начинается ходом 1.g4 и относится к редким, острым и провокационным началам.',
    openingName: 'Дебют Гроба',
    moves: [
        { moveNumber: 1, side: 'white', pieceName: 'пешка', from: 'g2', to: 'g4', notation: '1. g4', explanation: 'Белые сразу начинают фланговую игру и провоцируют чёрных на активную борьбу.' },
        { moveNumber: 1, side: 'black', pieceName: 'пешка', from: 'd7', to: 'd5', notation: '... d5', explanation: 'Наиболее популярная и принципиальная реакция. Пешка g4 сразу становится объектом атаки.' },

        { moveNumber: 2, side: 'white', pieceName: 'слон', from: 'f1', to: 'g2', notation: '2. Сg2', explanation: 'Белые развивают слона на большую диагональ и готовят давление на центр.' },
        { moveNumber: 2, side: 'black', pieceName: 'пешка', from: 'c7', to: 'c6', notation: '... c6', explanation: 'Чёрные укрепляют центр и готовят дальнейшее продвижение e5.' },

        { moveNumber: 3, side: 'white', pieceName: 'пешка', from: 'h2', to: 'h3', notation: '3. h3', explanation: 'Белые поддерживают пешку g4 и сохраняют фланговую структуру.' },
        { moveNumber: 3, side: 'black', pieceName: 'пешка', from: 'e7', to: 'e5', notation: '... e5', explanation: 'Чёрные занимают центр и получают активное пространство.' },

        { moveNumber: 4, side: 'white', pieceName: 'пешка', from: 'd2', to: 'd4', notation: '4. d4', explanation: 'Белые вступают в борьбу за центр.' },
        { moveNumber: 4, side: 'black', pieceName: 'пешка', from: 'e5', to: 'e4', notation: '... e4', explanation: 'Чёрные продвигают пешку и ограничивают развитие белых фигур.' },

        { moveNumber: 5, side: 'white', pieceName: 'пешка', from: 'c2', to: 'c4', notation: '5. c4', explanation: 'Белые начинают подрыв центра и пытаются использовать давление по диагонали слона g2.' },
        { moveNumber: 5, side: 'black', pieceName: 'слон', from: 'f8', to: 'd6', notation: '... Сd6', explanation: 'Чёрные активно развивают слона и поддерживают центральную пешку e5/e4.' },

        { moveNumber: 6, side: 'white', pieceName: 'конь', from: 'b1', to: 'c3', notation: '6. Кc3', explanation: 'Белые развивают коня и усиливают давление на пешку e4.' },
        { moveNumber: 6, side: 'black', pieceName: 'конь', from: 'g8', to: 'e7', notation: '... Кe7', explanation: 'Чёрные развивают коня и готовят защиту центра.' },

        { moveNumber: 7, side: 'white', pieceName: 'ферзь', from: 'd1', to: 'b3', notation: '7. Фb3', explanation: 'Белые давят на b7 и d5, используя ослабления после ранней фланговой игры.' },
        { moveNumber: 7, side: 'black', pieceName: 'король', from: 'e8', to: 'g8', notation: '... O-O', explanation: 'Чёрные рокируют и обеспечивают безопасность короля.' },

        { moveNumber: 8, side: 'white', pieceName: 'слон', from: 'c1', to: 'g5', notation: '8. Сg5', explanation: 'Белые развивают слона и создают давление на коня e7.' },
        { moveNumber: 8, side: 'black', pieceName: 'пешка', from: 'f7', to: 'f6', notation: '... f6', explanation: 'Чёрные укрепляют пешку e5/e4 и оттесняют активные фигуры белых.' },

        { moveNumber: 9, side: 'white', pieceName: 'слон', from: 'g5', to: 'd2', notation: '9. Сd2', explanation: 'Белые отводят слона и сохраняют фигуру для дальнейшей игры.' },
        { moveNumber: 9, side: 'black', pieceName: 'король', from: 'g8', to: 'h8', notation: '... Крh8', explanation: 'Чёрные уводят короля с потенциально опасной диагонали.' },

        { moveNumber: 10, side: 'white', pieceName: 'ладья', from: 'a1', to: 'c1', notation: '10. Лc1', explanation: 'Белые занимают полуоткрытую линию c и усиливают давление на ферзевом фланге.' },
        { moveNumber: 10, side: 'black', pieceName: 'конь', from: 'b8', to: 'a6', notation: '... Кa6', explanation: 'Чёрные переводят коня к активным полям на ферзевом фланге.' },

        { moveNumber: 11, side: 'white', pieceName: 'пешка', from: 'e2', to: 'e3', notation: '11. e3', explanation: 'Белые открывают линии для развития и пытаются стабилизировать центр.' },
        { moveNumber: 11, side: 'black', pieceName: 'пешка', from: 'f6', to: 'f5', notation: '... f5', explanation: 'Чёрные укрепляют пешку e4 и получают пространство на королевском фланге.' },

        { moveNumber: 12, side: 'white', pieceName: 'конь', from: 'g1', to: 'e2', notation: '12. Кge2', explanation: 'Белые развивают второго коня и готовят борьбу за центральные поля.' },
        { moveNumber: 12, side: 'black', pieceName: 'конь', from: 'a6', to: 'b4', notation: '... Кb4', explanation: 'Чёрный конь входит на активное поле и атакует важные пункты.' },

        { moveNumber: 13, side: 'white', pieceName: 'конь', from: 'c3', to: 'e4', notation: '13. Кxe4', explanation: 'Белые забирают центральную пешку e4.' },
        { moveNumber: 13, side: 'black', pieceName: 'конь', from: 'b4', to: 'a2', notation: '... Кxa2', explanation: 'Чёрные получают материал на ферзевом фланге.' },

        { moveNumber: 14, side: 'white', pieceName: 'конь', from: 'e4', to: 'd6', notation: '14. Кxd6', explanation: 'Белые забирают слона d6 и продолжают тактическую борьбу.' },
        { moveNumber: 14, side: 'black', pieceName: 'конь', from: 'a2', to: 'c1', notation: '... Кxc1', explanation: 'Чёрные забирают ладью на c1.' },

        { moveNumber: 15, side: 'white', pieceName: 'конь', from: 'e2', to: 'c1', notation: '15. Кxc1', explanation: 'Белые уничтожают активного коня чёрных.' },
        { moveNumber: 15, side: 'black', pieceName: 'ферзь', from: 'd8', to: 'd6', notation: '... Фxd6', explanation: 'Чёрные забирают коня на d6 и восстанавливают материальный баланс.' },
    ],
    resultDescription:
        'В дебюте Гроба белые с первых ходов провоцируют острую борьбу, но чёрные при точной игре получают сильный центр, активные фигуры и контригру.',
};