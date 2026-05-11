import type { TacticScenario } from '../types';

export const basicTactics: TacticScenario[] = [
    {
        id: 'mate-in-one-1',
        type: 'tactic',
        title: 'Мат в 1 ход',
        description: 'Белые начинают. Найдите мат в один ход.',
        fen: '6k1/5ppp/8/8/8/8/5P1P/6KQ w - - 0 1',
        correctMove: {
            from: 'h1',
            to: 'a8',
        },
        hint: 'Ферзь может дать мат по диагонали.',
        explanation:
            'Ход Фa8# ставит мат. Ферзь атакует короля по 8-й горизонтали, а поля отхода короля перекрыты собственными фигурами и контролем ферзя.',
        theme: 'мат в 1',
    },
    {
        id: 'mate-in-one-2',
        type: 'tactic',
        title: 'Мат в 1 ход',
        description: 'Белые начинают. Найдите мат в один ход.',
        fen: '1k6/8/QK6/8/8/8/8/8 w - - 0 1',
        correctMove: {
            from: 'a6',
            to: 'b7',
        },
        hint: 'Ферзь должен встать рядом с королём, но под защитой своего короля.',
        explanation:
            'Ход Фb7# ставит мат. Ферзь атакует короля на b8, а белый король защищает ферзя и контролирует поля отхода.',
        theme: 'мат в 1',
    },
    {
        id: 'mate-in-two-1',
        type: 'tactic',
        title: 'Мат в 2 хода',
        description: 'Белые начинают. Найдите форсированный мат в два хода.',
        fen: '8/2q2p1k/5Bp1/8/8/6P1/6K1/R7 w - - 0 1',
        correctMove: {
            from: 'a1',
            to: 'h1',
        },
        hint: 'Первый ход — шах ладьёй по линии h.',
        explanation:
            'Первый ход Лh1+ вынуждает короля отойти на g8. После этого белые завершают партию ходом Лh8#.',
        theme: 'мат в 2',
    }
];