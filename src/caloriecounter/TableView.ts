import hh from 'hyperscript-helpers';
import {h} from 'virtual-dom';
import * as R from 'ramda';
import {deleteMealMsg, editMealMsg} from './Update';
import {dispatchFn} from "./View";
import {Meal} from "./Model";

const {
    div,
    table,
    thead,
    tbody,
    tr,
    th,
    td,
    i,
} = hh(h);

function cell(tag: Function, className: string, value: unknown) {
    return tag({className}, value);
}

const tableHeader = thead([
    tr([
        cell(th, 'pa2 tl', 'Meal'),
        cell(th, 'pa2 tr', 'Calories'),
        cell(th, '', ''),
    ]),
]);

function mealRow(dispatch: dispatchFn, className: string, meal: Meal) {
    return tr({className}, [
        cell(td, 'pa2', meal.description),
        cell(td, 'pa2 tr', meal.calories),
        cell(td, 'pa2 tr', [
            i({
                className: 'ph1 fa fa-trash-o pointer',
                onclick: () => dispatch(deleteMealMsg(meal.id)),
            }),
            i({
                className: 'ph1 fa fa-pencil-square-o pointer',
                onclick: () => dispatch(editMealMsg(meal.id)),
            }),
        ]),
    ]);
}

function totalRow(meals: Array<Meal>) {
    const total = R.pipe(
        R.map((meal: Meal) => meal.calories),
        R.sum,
    )(meals);
    return tr({className: 'bt b'}, [
        cell(td, 'pa2 tr', 'Total:'),
        cell(td, 'pa2 tr', total),
        cell(td, '', ''),
    ]);
}

function mealsBody(dispatch: dispatchFn, className: string, meals: Array<Meal>) {
    const rows = R.map(
        R.partial(mealRow, [dispatch, 'stripe-dark']),
        meals);

    const rowsWithTotal = [...rows, totalRow(meals)];

    return tbody({className}, rowsWithTotal);
}

function tableView(dispatch: dispatchFn, meals: Array<Meal>) {
    if (meals.length === 0) {
        return div({className: 'mv2 i black-50'}, 'No meals to display...');
    }
    return table({className: 'mv2 w-100 collapse'}, [
        tableHeader,
        mealsBody(dispatch, '', meals),
    ]);
}

export default tableView;
