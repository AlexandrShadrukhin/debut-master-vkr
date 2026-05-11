import type { OpeningScenario } from '../types';

export const slavDefense: OpeningScenario = {
    id: 'opening-slav-defense',
    type: 'opening',
    title: 'Славянская защита',
    description:
        'Славянская защита возникает после ходов 1.d4 d5 2.c4 c6 и применяется чёрными против ферзевого гамбита.',
    openingName: 'Славянская защита',
    moves: [
        {
            moveNumber: 1,
            side: 'white',
            pieceName: 'пешка',
            from: 'd2',
            to: 'd4',
            notation: '1. d4',
            explanation:
                'Белые занимают центр и начинают игру в структурах закрытых начал.',
        },
        {
            moveNumber: 1,
            side: 'black',
            pieceName: 'пешка',
            from: 'd7',
            to: 'd5',
            notation: '... d5',
            explanation:
                'Чёрные отвечают симметрично и также борются за центральные поля.',
        },
        {
            moveNumber: 2,
            side: 'white',
            pieceName: 'пешка',
            from: 'c2',
            to: 'c4',
            notation: '2. c4',
            explanation:
                'Белые переходят к ферзевому гамбиту, оказывая давление на пешку d5.',
        },
        {
            moveNumber: 2,
            side: 'black',
            pieceName: 'пешка',
            from: 'c7',
            to: 'c6',
            notation: '... c6',
            explanation:
                'Ходом c6 чёрные укрепляют пешку d5 и получают славянскую защиту.',
        },
        {
            moveNumber: 3,
            side: 'white',
            pieceName: 'конь',
            from: 'g1',
            to: 'f3',
            notation: '3. Кf3',
            explanation:
                'Белые развивают коня и продолжают подготовку игры в центре.',
        },
        {
            moveNumber: 3,
            side: 'black',
            pieceName: 'конь',
            from: 'g8',
            to: 'f6',
            notation: '... Кf6',
            explanation:
                'Чёрные развивают коня и усиливают контроль центральных полей.',
        },
        {
            moveNumber: 4,
            side: 'white',
            pieceName: 'конь',
            from: 'b1',
            to: 'c3',
            notation: '4. Кc3',
            explanation:
                'Белые усиливают давление на центр и готовят дальнейшее развитие фигур.',
        },
        {
            moveNumber: 4,
            side: 'black',
            pieceName: 'пешка',
            from: 'e7',
            to: 'e6',
            notation: '... e6',
            explanation:
                'Чёрные укрепляют центр. Этот ход ведёт к одной из основных схем славянской защиты.',
        },
        {
            moveNumber: 5,
            side: 'white',
            pieceName: 'пешка',
            from: 'e2',
            to: 'e3',
            notation: '5. e3',
            explanation:
                'Белые открывают дорогу слону f1 и готовят спокойное развитие.',
        },
        {
            moveNumber: 5,
            side: 'black',
            pieceName: 'конь',
            from: 'b8',
            to: 'd7',
            notation: '... Кbd7',
            explanation:
                'Чёрные развивают второго коня и поддерживают центральные поля.',
        },
        {
            moveNumber: 6,
            side: 'white',
            pieceName: 'слон',
            from: 'f1',
            to: 'd3',
            notation: '6. Сd3',
            explanation:
                'Белые выводят слона на активную диагональ и готовят дальнейшую игру в центре.',
        },
        {
            moveNumber: 6,
            side: 'black',
            pieceName: 'пешка',
            from: 'd5',
            to: 'c4',
            notation: '... dxc4',
            explanation:
                'Чёрные забирают пешку c4. Этот ход характерен для перехода к меранским структурам.',
        },
        {
            moveNumber: 7,
            side: 'white',
            pieceName: 'слон',
            from: 'd3',
            to: 'c4',
            notation: '7. Сxc4',
            explanation:
                'Белые возвращают пешку и сохраняют активное развитие фигур.',
        },
        {
            moveNumber: 7,
            side: 'black',
            pieceName: 'пешка',
            from: 'b7',
            to: 'b5',
            notation: '... b5',
            explanation:
                'Чёрные получают меранский вариант: атакуют слона и начинают пешечное наступление на ферзевом фланге.',
        },
    ],
    resultDescription:
        'Славянская защита строится на прочном позиционном фундаменте: чёрные укрепляют пешку d5 ходом c6, сохраняют возможность развития белопольного слона и создают предпосылки для игры на ферзевом фланге. Планы белых в основном связаны с борьбой в центре.',
};