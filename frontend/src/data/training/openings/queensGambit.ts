import type { OpeningScenario } from '../types';

export const queensGambit: OpeningScenario = {
    id: 'opening-queens-gambit',
    type: 'opening',
    title: 'Ферзевый гамбит',
    description: 'Изучите вариант принятого ферзевого гамбита с развитием фигур и борьбой за центр.',
    openingName: 'Ферзевый гамбит',
    moves: [
        { moveNumber: 1, side: 'white', pieceName: 'пешка', from: 'd2', to: 'd4', notation: '1. d4', explanation: 'Белые занимают центр и открывают линию для слона c1.' },
        { moveNumber: 1, side: 'black', pieceName: 'пешка', from: 'd7', to: 'd5', notation: '... d5', explanation: 'Чёрные симметрично борются за центральные поля.' },

        { moveNumber: 2, side: 'white', pieceName: 'пешка', from: 'c2', to: 'c4', notation: '2. c4', explanation: 'Белые предлагают ферзевый гамбит, атакуя пешку d5 и стремясь усилить контроль центра.' },
        { moveNumber: 2, side: 'black', pieceName: 'пешка', from: 'd5', to: 'c4', notation: '... dxc4', explanation: 'Чёрные принимают гамбит и временно забирают пешку c4.' },

        { moveNumber: 3, side: 'white', pieceName: 'конь', from: 'g1', to: 'f3', notation: '3. Кf3', explanation: 'Главное продолжение: белые развивают коня и готовят быстрый возврат пешки.' },
        { moveNumber: 3, side: 'black', pieceName: 'конь', from: 'g8', to: 'f6', notation: '... Кf6', explanation: 'Чёрные развивают коня и контролируют центральные поля e4 и d5.' },

        { moveNumber: 4, side: 'white', pieceName: 'пешка', from: 'e2', to: 'e3', notation: '4. e3', explanation: 'Белые открывают дорогу слону f1 и готовят отыгрыш пешки c4.' },
        { moveNumber: 4, side: 'black', pieceName: 'пешка', from: 'e7', to: 'e6', notation: '... e6', explanation: 'Чёрные укрепляют центр и открывают дорогу слону f8.' },

        { moveNumber: 5, side: 'white', pieceName: 'слон', from: 'f1', to: 'c4', notation: '5. Сxc4', explanation: 'Белые возвращают пожертвованную пешку и развивают слона на активную диагональ.' },
        { moveNumber: 5, side: 'black', pieceName: 'пешка', from: 'c7', to: 'c5', notation: '... c5', explanation: 'Чёрные сразу подрывают центр белых и борются против пешки d4.' },

        { moveNumber: 6, side: 'white', pieceName: 'король', from: 'e1', to: 'g1', notation: '6. O-O', explanation: 'Белые рокируют и обеспечивают безопасность короля.' },
        { moveNumber: 6, side: 'black', pieceName: 'пешка', from: 'a7', to: 'a6', notation: '... a6', explanation: 'Чёрные готовят возможное продвижение b5 и расширение на ферзевом фланге.' },

        { moveNumber: 7, side: 'white', pieceName: 'слон', from: 'c4', to: 'b3', notation: '7. Сb3', explanation: 'Белые отводят слона из-под возможной атаки и сохраняют давление по диагонали.' },
        { moveNumber: 7, side: 'black', pieceName: 'конь', from: 'b8', to: 'c6', notation: '... Кc6', explanation: 'Чёрные развивают коня и усиливают давление на центр.' },

        { moveNumber: 8, side: 'white', pieceName: 'конь', from: 'b1', to: 'c3', notation: '8. Кc3', explanation: 'Белые развивают второго коня и укрепляют центральные поля.' },
        { moveNumber: 8, side: 'black', pieceName: 'пешка', from: 'c5', to: 'd4', notation: '... cxd4', explanation: 'Чёрные разменивают пешку и фиксируют напряжение в центре.' },

        { moveNumber: 9, side: 'white', pieceName: 'пешка', from: 'e3', to: 'd4', notation: '9. exd4', explanation: 'Белые возвращают пешку и получают структуру с изолированной пешкой d4.' },
        { moveNumber: 9, side: 'black', pieceName: 'слон', from: 'f8', to: 'e7', notation: '... Сe7', explanation: 'Чёрные спокойно развивают слона и готовят рокировку.' },

        { moveNumber: 10, side: 'white', pieceName: 'ладья', from: 'f1', to: 'e1', notation: '10. Лe1', explanation: 'Белые ставят ладью на открытую линию e и усиливают давление в центре.' },
        { moveNumber: 10, side: 'black', pieceName: 'король', from: 'e8', to: 'g8', notation: '... O-O', explanation: 'Чёрные рокируют и завершают развитие короля.' },

        { moveNumber: 11, side: 'white', pieceName: 'слон', from: 'c1', to: 'f4', notation: '11. Сf4', explanation: 'Белые развивают слона на активную диагональ и усиливают контроль центра.' },
        { moveNumber: 11, side: 'black', pieceName: 'конь', from: 'c6', to: 'a5', notation: '... Кa5', explanation: 'Чёрные атакуют слона b3 и стремятся получить темп.' },

        { moveNumber: 12, side: 'white', pieceName: 'слон', from: 'b3', to: 'c2', notation: '12. Сc2', explanation: 'Белые отводят слона, сохраняя его на диагонали b1-h7.' },
        { moveNumber: 12, side: 'black', pieceName: 'пешка', from: 'b7', to: 'b5', notation: '... b5', explanation: 'Чёрные расширяются на ферзевом фланге и прогоняют белые фигуры.' },

        { moveNumber: 13, side: 'white', pieceName: 'пешка', from: 'd4', to: 'd5', notation: '13. d5', explanation: 'Белые продвигают изолированную пешку, выигрывая пространство и атакуя центр.' },
        { moveNumber: 13, side: 'black', pieceName: 'пешка', from: 'e6', to: 'd5', notation: '... exd5', explanation: 'Чёрные принимают вызов и ликвидируют продвинутую пешку.' },

        { moveNumber: 14, side: 'white', pieceName: 'ферзь', from: 'd1', to: 'd3', notation: '14. Фd3', explanation: 'Белые переводят ферзя на активную позицию и создают угрозы на королевском фланге.' },
        { moveNumber: 14, side: 'black', pieceName: 'конь', from: 'a5', to: 'c6', notation: '... Кc6', explanation: 'Чёрные возвращают коня в центр, укрепляя защиту.' },

        { moveNumber: 15, side: 'white', pieceName: 'слон', from: 'f4', to: 'g5', notation: '15. Сg5', explanation: 'Белые связывают фигуры чёрных и усиливают давление на королевском фланге.' },
        { moveNumber: 15, side: 'black', pieceName: 'слон', from: 'c8', to: 'e6', notation: '... Сe6', explanation: 'Чёрные развивают последнюю лёгкую фигуру и стабилизируют позицию.' },
    ],
    resultDescription:
        'В этом варианте принятого ферзевого гамбита белые быстро возвращают пешку и получают активную игру, а чёрные стремятся уравнять за счёт давления на центр и активности на ферзевом фланге.',
};