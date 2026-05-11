export type {
    TacticScenario,
    OpeningMove,
    OpeningScenario,
    TrainingScenario,
} from './types';


import { basicTactics } from './tactics';
import {
    grobOpening,
    ruyLopez,
    italianGame,
    queensGambit,
    slavDefense,
    frenchDefense,
} from './openings';

export const tacticScenarios = basicTactics;

export const openingScenarios = [
    grobOpening,
    ruyLopez,
    italianGame,
    queensGambit,
    slavDefense,
    frenchDefense,
];

export const trainingScenarios = [
    ...tacticScenarios,
    ...openingScenarios,
];