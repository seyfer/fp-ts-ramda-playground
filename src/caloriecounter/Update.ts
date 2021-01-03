import * as R from 'ramda';
import { Meal, State } from "./Model";
import { message } from "../types";

export type updateFn = (message: message, model: State) => State;

const MSGS = {
    SHOW_FORM: 'SHOW_FORM',
    MEAL_INPUT: 'MEAL_INPUT',
    CALORIES_INPUT: 'CALORIES_INPUT',
    SAVE_MEAL: 'SAVE_MEAL',
    DELETE_MEAL: 'DELETE_MEAL',
    EDIT_MEAL: 'EDIT_MEAL',
};

export function showFormMsg(showForm: boolean): message {
    return {
        type: MSGS.SHOW_FORM,
        showForm,
    };
}

export function mealInputMsg(description: string): message {
    return {
        type: MSGS.MEAL_INPUT,
        description,
    };
}

export function caloriesInputMsg(calories: number): message {
    return {
        type: MSGS.CALORIES_INPUT,
        calories,
    };
}

export const saveMealMsg = { type: MSGS.SAVE_MEAL };

export function deleteMealMsg(id: number): message {
    return {
        type: MSGS.DELETE_MEAL,
        id,
    };
}

export function editMealMsg(editId: number): message {
    return {
        type: MSGS.EDIT_MEAL,
        editId,
    };
}

const update: updateFn = function (message, model) {
    switch (message.type) {
        case MSGS.SHOW_FORM: {
            const { showForm } = message;
            const form = { ...model.form, showForm, description: '', calories: 0 };
            return { ...model, form };
        }
        case MSGS.MEAL_INPUT: {
            const { description } = message;
            const form = { ...model.form, description };
            return { ...model, form };
        }
        case MSGS.CALORIES_INPUT: {
            const caloriesFn = R.pipe(
                parseInt,
                R.defaultTo(0),
            );
            // @ts-ignore
            const calories = caloriesFn(message.calories as number);
            const form = { ...model.form, calories };
            return { ...model, form };
        }
        case MSGS.SAVE_MEAL: {
            const { editId } = model.form;
            return editId !== null ?
                edit(model) :
                add(model);
        }
        case MSGS.DELETE_MEAL: {
            const { id } = message;
            const meals = R.filter(
                meal => meal.id !== id
                , model.meals);
            return { ...model, meals };
        }
        case MSGS.EDIT_MEAL: {
            const { editId } = message;
            const meal = R.find(
                meal => meal.id === editId,
                model.meals);

            const { description, calories } = meal as Meal;
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

function add(model: State) {
    const { nextId } = model;
    const { description, calories } = model.form;
    const meal = { id: nextId, description, calories };
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

function edit(model: State) {
    const { description, calories, editId } = model.form;
    const meals = R.map(meal => {
        if (meal.id === editId) {
            return { ...meal, description, calories };
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
