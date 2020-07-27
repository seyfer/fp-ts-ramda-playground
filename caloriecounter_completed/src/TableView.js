import hh from 'hyperscript-helpers';
import {h} from 'virtual-dom';
import * as R from 'ramda';
import {deleteMealMsg, editMealMsg} from './Update';

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

function cell(tag, className, value) {
  return tag({className}, value);
}

const tableHeader = thead([
  tr([
    cell(th, 'pa2 tl', 'Meal'),
    cell(th, 'pa2 tr', 'Calories'),
    cell(th, '', ''),
  ]),
]);

function mealRow(dispatch, className, meal) {
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

function totalRow(meals) {
  const total = R.pipe(
    R.map(meal => meal.calories),
    R.sum,
  )(meals);
  return tr({className: 'bt b'}, [
    cell(td, 'pa2 tr', 'Total:'),
    cell(td, 'pa2 tr', total),
    cell(td, '', ''),
  ]);
}

function mealsBody(dispatch, className, meals) {
  const rows = R.map(
    R.partial(mealRow, [dispatch, 'stripe-dark']),
    meals);

  const rowsWithTotal = [...rows, totalRow(meals)];

  return tbody({className}, rowsWithTotal);
}

function tableView(dispatch, meals) {
  if (meals.length === 0) {
    return div({className: 'mv2 i black-50'}, 'No meals to display...');
  }
  return table({className: 'mv2 w-100 collapse'}, [
    tableHeader,
    mealsBody(dispatch, '', meals),
  ]);
}

export default tableView;
