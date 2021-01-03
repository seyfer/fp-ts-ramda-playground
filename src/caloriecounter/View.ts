import formView from './FormView';
import tableView from './TableView';
import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';
import { State } from "./Model";
import { dispatchFn } from "../types";
import VNode = VirtualDOM.VNode;

const {
    div,
    h1,
    pre,
} = hh(h);

export type viewFn = (dispatch: dispatchFn, model: State) => VNode;

const view: viewFn = function (dispatch, model) {
    return div({ className: 'mw6 center' }, [
        h1({ className: 'f2 pv2 bb' }, 'Calorie Counter'),
        formView(dispatch, model),
        tableView(dispatch, model.meals),
        pre(JSON.stringify(model, null, 2)),
    ]);
}

export default view;
