import * as R from 'ramda';
import { Card, State } from "./Model";

export const MSGS = {
    QUESTION_INPUT: 'QUESTION_INPUT',
    ANSWER_INPUT: 'ANSWER_INPUT',
    SAVE: 'SAVE',
    SHOW_ANSWER: 'SHOW_ANSWER',
    SCORE: 'SCORE',
    NEW_CARD: 'NEW_CARD',
    EDIT_CARD: 'EDIT_CARD',
    DELETE_CARD: 'DELETE_CARD',
};

export type message = { type: string, [key: string]: any };
export type updateFn = (message: message, model: State) => State;

export enum SCORES {
    BAD,
    GOOD,
    GREAT,
}

export function questionInputMsg(id: number, question: string) {
    return {
        type: MSGS.QUESTION_INPUT,
        id,
        question,
    };
}

export function answerInputMsg(id: number, answer: string) {
    return {
        type: MSGS.ANSWER_INPUT,
        id,
        answer,
    };
}

export function saveMsg(id: number) {
    return {
        type: MSGS.SAVE,
        id,
    };
}

export function showAnswerMsg(id: number) {
    return {
        type: MSGS.SHOW_ANSWER,
        id,
    };
}

export function scoreMsg(id: number, score: SCORES) {
    return {
        type: MSGS.SCORE,
        id,
        score,
    };
}

export function editCardMsg(id: number) {
    return {
        type: MSGS.EDIT_CARD,
        id,
    };
}

export function deleteCardMsg(id: number) {
    return {
        type: MSGS.DELETE_CARD,
        id,
    };
}

export const newCardMsg = {
    type: MSGS.NEW_CARD,
};

const updateCards = R.curry((updateCard: Record<string, any>, card: Card) => {
    if (updateCard.id === card.id) {
        return { ...card, ...updateCard };
    }
    return card;
});

const update: updateFn = function (message, model) {
    switch (message.type) {
        case MSGS.QUESTION_INPUT: {
            const { id, question } = message;
            const { cards } = model;
            const updatedCards = R.map<Card, Card>(updateCards({ id, question }), cards);
            return { ...model, cards: updatedCards };
        }
        case MSGS.ANSWER_INPUT: {
            const { id, answer } = message;
            const { cards } = model;
            const updatedCards = R.map<Card, Card>(updateCards({ id, answer }), cards);
            return { ...model, cards: updatedCards };
        }
        case MSGS.SAVE: {
            const { id } = message;
            const { cards } = model;
            const updatedCards = R.map<Card, Card>(updateCards({ id, edit: false }), cards);
            return { ...model, cards: updatedCards };
        }
        case MSGS.SHOW_ANSWER: {
            const { id } = message;
            const { cards } = model;
            const updatedCards = R.map<Card, Card>(updateCards({ id, showAnswer: true }), cards);
            return { ...model, cards: updatedCards };
        }
        case MSGS.EDIT_CARD: {
            const { id } = message;
            const { cards } = model;
            const updatedCards = R.map<Card, Card>(updateCards({ id, edit: true }), cards);
            return { ...model, cards: updatedCards };
        }
        case MSGS.SCORE: {
            const { id, score } = message;
            const { cards }: { cards: Array<Card> } = model;
            const card = R.find(R.propEq('id', id), cards)!;

            const rank = R.cond<{ score: SCORES, rank: number }, number>([
                [R.propEq('score', SCORES.BAD), R.always(SCORES.BAD)],
                [R.propEq('score', SCORES.GOOD), ({ rank }) => rank + 1],
                [R.propEq('score', SCORES.GREAT), ({ rank }) => rank + 2],
            ])({ score, rank: card.rank });
            const updatedCards = R.pipe<Card[], Card[], Card[]>(
                R.map<Card, Card>(updateCards({ id, showAnswer: false, rank })),
                R.sortWith([
                        R.ascend(R.prop('rank')),
                        R.descend(R.prop('id'))
                    ]
                ),
            )(cards as Card[]);
            return { ...model, cards: updatedCards as Card[] };
        }
        case MSGS.NEW_CARD: {
            const { nextId: id, cards } = model;
            const newCard: Card = {
                id,
                question: '',
                answer: '',
                rank: 0,
                showAnswer: false,
                edit: true,
            };
            const updatedCards = R.prepend(newCard, cards);
            return { ...model, cards: updatedCards, nextId: id + 1 };
        }
        case MSGS.DELETE_CARD: {
            const { id } = message;
            const { cards } = model;
            const updatedCards = R.reject(R.propEq('id', id), cards);
            return { ...model, cards: updatedCards };
        }
        default:
            return model;
    }
}

export default update;
