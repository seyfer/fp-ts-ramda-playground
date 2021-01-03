import * as R from 'ramda';
import hh from 'hyperscript-helpers';
import { h, VNode } from 'virtual-dom';

import { addLocationMsg, clearErrorMsg, locationInputMsg, message, removeLocationMsg } from './Update';
import { Location, State } from "./Model";

const { div, h1, label, input, form, button, ul, li, i } = hh(h);

export type dispatchFn = (message: message) => void;
export type viewFn = (dispatch: dispatchFn, model: State) => VNode;

function locationForm(dispatch: dispatchFn, model: State) {
    return div({ className: '' }, [
        form(
            {
                className: '',
                onsubmit: (e: InputEvent) => {
                    e.preventDefault();
                    dispatch(addLocationMsg);
                },
            },
            [
                label({ className: 'f6 b db mb2' }, 'Location'),
                input({
                    className: 'pa2 w-60',
                    value: model.location,
                    oninput: (e: InputEvent) => dispatch(locationInputMsg((e.target! as HTMLInputElement).value)),
                }),
                button({ className: 'pv2 ph3 br1', type: 'submit' }, 'Add'),
            ],
        ),
    ]);
}

function cell(className: string, label: string, temp: string) {
    return div({ className }, [div({ className: 'f7 b' }, label), div({}, temp)]);
}

const location = R.curry((dispatch: dispatchFn, location: Location) => {
    const { name, temp, low, high, id } = location;
    return li(
        { className: 'pa3 bb b--light-silver flex justify-between relative' },
        [
            cell('w-60 tl', 'Location', name),
            cell('w-12 tc', 'Temp °C', temp),
            cell('w-10 tc', 'Low °C', low),
            cell('w-10 tc mr2', 'High °C', high),
            i({
                className:
                    'relative top--1 right--1 mt1 mr1 fa fa-remove pointer black-40',
                onclick: () => dispatch(removeLocationMsg(id)),
            }),
        ],
    );
});

function locations(dispatch: dispatchFn, model: State) {
    const locations = R.map(location(dispatch), model.locations);
    return ul({ className: 'list pl0 ml0 ba b--light-silver br' }, locations);
}

function error(dispatch: dispatchFn, model: State) {
    if (!model.error) {
        return null;
    }
    return div({ className: 'pa2 mv2 bg-red white relative' }, [
        model.error,
        i({
            className:
                'white absolute top-0 right-0 mt1 mr1 fa fa-remove pointer black-40',
            onclick: () => dispatch(clearErrorMsg),
        }),
    ]);
}

const view: viewFn = function (dispatch, model) {
    return div({ className: 'mw6 center' }, [
        h1({ className: 'f2 pv2 bb' }, ['Weather']),
        error(dispatch, model),
        locationForm(dispatch, model),
        locations(dispatch, model),
    ]);
}

export default view;
