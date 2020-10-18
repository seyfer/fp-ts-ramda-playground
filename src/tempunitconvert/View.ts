import * as R from 'ramda';
import hh from 'hyperscript-helpers';
import { h, VNode } from 'virtual-dom';
import {
    leftUnitChangedMsg,
    leftValueInputMsg,
    message,
    rightUnitChangedMsg,
    rightValueInputMsg,
    unitFn,
    valueFn
} from './Update';
import { State, temperatureUnit } from "./Model";

const {
    div,
    h1,
    pre,
    input,
    select,
    option,
} = hh(h);

const UNITS: temperatureUnit[] = ['Fahrenheit', 'Celsius', 'Kelvin'];

export type dispatchFn = (message: message) => void;
export type viewFn = (dispatch: dispatchFn, model: State) => VNode;

function unitOptions(selectedUnit: temperatureUnit) {
    return R.map(
        unit => option({ value: unit, selected: selectedUnit === unit }, unit),
        UNITS,
    );
}

function unitSection(
    dispatch: dispatchFn,
    unit: temperatureUnit,
    value: string,
    inputMsg: valueFn,
    unitMsg: unitFn
) {
    return div({ className: 'w-50 ma1' }, [
        input({
            type: 'number',
            className: 'db w-100 mv2 pa2 input-reset ba',
            value,
            oninput: (e: InputEvent) => dispatch(
                inputMsg((e.target! as HTMLInputElement).value)
            ),
        }),
        select(
            {
                className: 'db w-100 pa2 ba input-reset br1 bg-white ba b--black',
                onchange: (e: InputEvent) => dispatch(
                    unitMsg(((e.target! as HTMLInputElement).value) as temperatureUnit)
                ),
            },
            unitOptions(unit),
        ),
    ]);
}

function view(dispatch: dispatchFn, model: State) {
    return div({ className: 'mw6 center' }, [
        h1({ className: 'f2 pv2 bb' }, 'Temperature Unit Converter'),
        div({ className: 'flex' }, [
            unitSection(
                dispatch,
                model.leftUnit,
                model.leftValue,
                leftValueInputMsg,
                leftUnitChangedMsg,
            ),
            unitSection(
                dispatch,
                model.rightUnit,
                model.rightValue,
                rightValueInputMsg,
                rightUnitChangedMsg,
            ),
        ]),
        pre(JSON.stringify(model, null, 2)),
    ]);
}

export default view;
