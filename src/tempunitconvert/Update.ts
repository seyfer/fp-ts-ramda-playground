import * as R from 'ramda';
import { State, temperatureUnit } from "./Model";
import { message } from "../types";

export const MSGS = {
    LEFT_VALUE_INPUT: 'LEFT_VALUE_INPUT',
    RIGHT_VALUE_INPUT: 'RIGHT_VALUE_INPUT',
    LEFT_UNIT_CHANGED: 'LEFT_UNIT_CHANGED',
    RIGHT_UNIT_CHANGED: 'RIGHT_UNIT_CHANGED',
};

export type updateFn = (message: message, model: State) => State;

export type valueFn = (value: string) => message;
export type unitFn = (value: temperatureUnit) => message;

export const leftValueInputMsg: valueFn = function (leftValue: string) {
    return {
        type: MSGS.LEFT_VALUE_INPUT,
        leftValue,
    };
}

export const rightValueInputMsg: valueFn = function (rightValue: string) {
    return {
        type: MSGS.RIGHT_VALUE_INPUT,
        rightValue,
    };
}

export const leftUnitChangedMsg: unitFn = function (leftUnit: temperatureUnit) {
    return {
        type: MSGS.LEFT_UNIT_CHANGED,
        leftUnit,
    };
}

export const rightUnitChangedMsg: unitFn = function (rightUnit: temperatureUnit) {
    return {
        type: MSGS.RIGHT_UNIT_CHANGED,
        rightUnit,
    };
}

const toNumber = R.pipe(parseFloat, R.defaultTo(0));

const update: updateFn = function (message, model) {
    switch (message.type) {
        case MSGS.LEFT_VALUE_INPUT: {
            if (message.leftValue === '') {
                return { ...model, sourceLeft: true, leftValue: '', rightValue: '' };
            }
            const leftValue = toNumber(message.leftValue);
            return convert({ ...model, sourceLeft: true, leftValue: leftValue.toString() });
        }
        case MSGS.RIGHT_VALUE_INPUT: {
            if (message.rightValue === '') {
                return { ...model, sourceLeft: false, leftValue: '', rightValue: '' };
            }
            const rightValue = toNumber(message.rightValue);
            return convert({ ...model, sourceLeft: false, rightValue: rightValue.toString() });
        }
        case MSGS.LEFT_UNIT_CHANGED: {
            const { leftUnit } = message;
            return convert({ ...model, leftUnit });
        }
        case MSGS.RIGHT_UNIT_CHANGED: {
            const { rightUnit } = message;
            return convert({ ...model, rightUnit });
        }
    }
    return model;
}


function round(number: number) {
    return Math.round(number * 10) / 10;
}

function convert(model: State): State {
    const { leftValue, leftUnit, rightValue, rightUnit } = model;

    const [fromUnit, fromTemp, toUnit] =
        model.sourceLeft
            ? [leftUnit, leftValue, rightUnit]
            : [rightUnit, rightValue, leftUnit];

    const otherValue = R.pipe(
        convertFromToTemp,
        round,
    )(fromUnit, toUnit, parseInt(fromTemp));

    return model.sourceLeft
        ? { ...model, rightValue: otherValue.toString() }
        : { ...model, leftValue: otherValue.toString() };
}

function convertFromToTemp(fromUnit: temperatureUnit, toUnit: temperatureUnit, temp: number) {
    const convertFn = R.pathOr(
        R.identity,
        [fromUnit, toUnit],
        UnitConversions);

    return convertFn(temp);
}

function FtoC(temp: number) {
    return 5 / 9 * (temp - 32);
}

function CtoF(temp: number) {
    return 9 / 5 * temp + 32;
}

function KtoC(temp: number) {
    return temp - 273.15;
}

function CtoK(temp: number) {
    return temp + 273.15;
}

const FtoK = R.pipe(FtoC, CtoK);
const KtoF = R.pipe(KtoC, CtoF);

const UnitConversions = {
    Celsius: {
        Fahrenheit: CtoF,
        Kelvin: CtoK,
    },
    Fahrenheit: {
        Celsius: FtoC,
        Kelvin: FtoK,
    },
    Kelvin: {
        Celsius: KtoC,
        Fahrenheit: KtoF,
    },
};

export default update;
