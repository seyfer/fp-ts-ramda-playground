import { State } from "./Model";

export type message = { type: string, [key: string]: any };
export type updateFn = (message: message, model: State) => State;

export const MSGS = {
    BILL_AMOUNT_INPUT: 'BILL_AMOUNT_INPUT',
    TIP_PERCENT_INPUT: 'TIP_PERCENT_INPUT',
};

export function billAmountInputMsg(billAmount: string) {
    return {
        type: MSGS.BILL_AMOUNT_INPUT,
        billAmount,
    };
}

export function tipPercentInputMsg(tipPercent: string) {
    return {
        type: MSGS.TIP_PERCENT_INPUT,
        tipPercent,
    };
}

const update: updateFn = function (message, model) {
    switch (message.type) {
        case MSGS.BILL_AMOUNT_INPUT: {
            const { billAmount } = message;
            return { ...model, billAmount };
        }
        case MSGS.TIP_PERCENT_INPUT: {
            const { tipPercent } = message;
            return { ...model, tipPercent };
        }
        default:
            return model;
    }
}

export default update;
