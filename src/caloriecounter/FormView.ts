import hh from 'hyperscript-helpers';
import {h} from 'virtual-dom';
import {caloriesInputMsg, mealInputMsg, saveMealMsg, showFormMsg} from './Update';
import {dispatchFn} from "./View";
import {State} from "./Model";

const {
    div,
    button,
    form,
    label,
    input,
} = hh(h);

function fieldSet(labelText: string, inputValue: string, oninput: (event: InputEvent) => void) {
    return div([
        label({className: 'db mb1'}, labelText),
        input({
            className: 'pa2 input-reset ba w-100 mb2',
            type: 'text',
            value: inputValue,
            oninput,
        }),
    ]);
}

function buttonSet(dispatch: dispatchFn) {
    return div([
        button(
            {
                className: 'f3 pv2 ph3 bg-blue white bn mr2 dim',
                type: 'submit',
            },
            'Save',
        ),
        button(
            {
                className: 'f3 pv2 ph3 bn bg-light-gray dim',
                type: 'button',
                onclick: () => dispatch(showFormMsg(false)),
            },
            'Cancel',
        ),
    ]);
}

function formView(dispatch: dispatchFn, model: State) {
    const {description, calories, showForm} = model.form;
    if (showForm) {
        return form(
            {
                className: 'w-100 mv2',
                onsubmit: (e: Event) => {
                    e.preventDefault();
                    dispatch(saveMealMsg);
                },
            },
            [
                fieldSet('Meal', description,
                    e => dispatch(mealInputMsg((e.target! as HTMLInputElement).value)),
                ),
                fieldSet('Calories', calories.toString() || '',
                    e => dispatch(caloriesInputMsg(parseInt((e.target! as HTMLInputElement).value))),
                ),
                buttonSet(dispatch),
            ],
        );
    }
    return button(
        {
            className: 'f3 pv2 ph3 bg-blue white bn',
            onclick: () => dispatch(showFormMsg(true)),
        },
        'Add Meal',
    );
}

export default formView;
