import * as R from 'ramda';

const MSGS = {
  SHOW_FORM: 'SHOW_FORM',
  MEAL_INPUT: 'MEAL_INPUT',
  CALORIES_INPUT: 'CALORIES_INPUT',
  SAVE_MEAL: 'SAVE_MEAL',
  DELETE_MEAL: 'DELETE_MEAL',
  EDIT_MEAL: 'EDIT_MEAL',
};

export function showFormMsg(showForm) {
  return {
    type: MSGS.SHOW_FORM,
    showForm,
  };
}

export function mealInputMsg(description) {
  return {
    type: MSGS.MEAL_INPUT,
    description,
  };
}

export function caloriesInputMsg(calories) {
  return {
    type: MSGS.CALORIES_INPUT,
    calories,
  };
}

export const saveMealMsg = {type: MSGS.SAVE_MEAL};

export function deleteMealMsg(id) {
  return {
    type: MSGS.DELETE_MEAL,
    id,
  };
}

export function editMealMsg(editId) {
  return {
    type: MSGS.EDIT_MEAL,
    editId,
  };
}

function update(msg, model) {
  switch (msg.type) {
    case MSGS.SHOW_FORM: {
      const {showForm} = msg;
      const form = {...model.form, showForm, description: '', calories: 0};
      return {...model, form};
    }
    case MSGS.MEAL_INPUT: {
      const {description} = msg;
      const form = {...model.form, description};
      return {...model, form};
    }
    case MSGS.CALORIES_INPUT: {
      const calories = R.pipe(
        parseInt,
        R.defaultTo(0),
      )(msg.calories);
      const form = {...model.form, calories};
      return {...model, form};
    }
    case MSGS.SAVE_MEAL: {
      const {editId} = model.form;
      return editId !== null ?
             edit(msg, model) :
             add(msg, model);
    }
    case MSGS.DELETE_MEAL: {
      const {id} = msg;
      const meals = R.filter(
        meal => meal.id !== id
        , model.meals);
      return {...model, meals};
    }
    case MSGS.EDIT_MEAL: {
      const {editId} = msg;
      const meal = R.find(
        meal => meal.id === editId,
        model.meals);

      const {description, calories} = meal;
      const form = {
        ...model.form,
        editId,
        description,
        calories,
        showForm: true,
      };
      return {
        ...model,
        form,
      };
    }
  }
  return model;
}

function add(msg, model) {
  const {nextId} = model;
  const {description, calories} = model.form;
  const meal = {id: nextId, description, calories};
  const meals = [...model.meals, meal];
  const form = {
    ...model.form,
    description: '',
    calories: 0,
    showForm: false,
  };
  return {
    ...model,
    meals,
    nextId: nextId + 1,
    form,
  };
}

function edit(msg, model) {
  const {description, calories, editId} = model.form;
  const meals = R.map(meal => {
    if (meal.id === editId) {
      return {...meal, description, calories};
    }
    return meal;
  }, model.meals);
  const form = {
    ...model.form,
    description: '',
    calories: 0,
    showForm: false,
    editId: null,
  };
  return {
    ...model,
    meals,
    form,
  };
}

export default update;
