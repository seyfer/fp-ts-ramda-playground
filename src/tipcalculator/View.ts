import * as R from 'ramda';
import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';

import { billAmountInputMsg, tipPercentInputMsg } from './Update';
import { State } from "./Model";
import { dispatchFn } from "../types";
import VNode = VirtualDOM.VNode;

const {
    div,
    h1,
    label,
    input,
} = hh(h);

export type viewFn = (dispatch: dispatchFn, model: State) => VNode;

const round = (places: number) =>
    R.pipe(
        (num: number) => num * Math.pow(10, places),
        Math.round,
        (num: number) => num * Math.pow(10, -1 * places),
    );

const formatMoney = R.curry(
    (symbol: string, places: number, number: number) => {
        return R.pipe<number, number, number, string, string>(
            () => number,
            R.defaultTo<number>(0),
            round(places),
            num => num.toFixed(places),
            R.concat(symbol),
        )();
    },
);

function calcTipAndTotal(billAmount: string, tipPercent: string) {
    const bill = parseFloat(billAmount);
    const tip = bill * parseFloat(tipPercent) / 100 || 0;
    return [tip, bill + tip];
}

function inputSet(name: string, value: string, oninput: (event: InputEvent) => void) {
    return div({ className: 'w-40' }, [
        label({ className: 'db fw6 lh-copy f5' }, name),
        input({
            className: 'border-box pa2 ba mb2 tr w-100',
            type: 'text',
            value,
            oninput,
        }),
    ]);
}

function calculatedAmounts(tip: string, total: string) {
    return div({ className: 'w-40 b bt mt2 pt2' }, [
        calculatedAmount('Tip:', tip),
        calculatedAmount('Total:', total),
    ]);
}

function calculatedAmount(description: string, amount: string) {
    return div({ className: 'flex w-100' }, [
        div({ className: 'w-50 pv1 pr2' }, description),
        div({ className: 'w-50 tr pv1 pr2' }, amount),
    ]);
}

const view: viewFn = function (dispatch, model) {
    const { billAmount, tipPercent } = model;

    const [tip, total] = calcTipAndTotal(billAmount, tipPercent);

    const toMoney = formatMoney('$', 2);

    return div({ className: 'mw6 center' }, [
        h1({ className: 'f2 pv2 bb' }, 'Tip Calculator'),
        inputSet('Bill Amount', billAmount, (e: InputEvent) =>
            dispatch(billAmountInputMsg((e.target! as HTMLInputElement).value)),
        ),
        inputSet('Tip %', tipPercent, (e: InputEvent) =>
            dispatch(tipPercentInputMsg((e.target! as HTMLInputElement).value)),
        ),
        calculatedAmounts(toMoney(tip), toMoney(total)),
    ]);
}

export default view;
