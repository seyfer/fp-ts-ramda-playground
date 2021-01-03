import hh from 'hyperscript-helpers';
import { diff, h, patch } from 'virtual-dom';
import createElement from 'virtual-dom/create-element';
import { dispatchFn, message } from "../types";
import VNode = VirtualDOM.VNode;

interface State {
    counter: 0;
}

type viewFn = (dispatch: dispatchFn, model: State) => VNode;
type updateFn = (message: message, model: State) => State;
type appFn = (
    initModel: State,
    update: updateFn,
    view: viewFn,
    node: HTMLElement
) => void;

const MESSAGES = {
    ADD: 'ADD',
    SUBTRACT: 'SUBTRACT',
}

const { div, button } = hh(h);

const initModel: State = { counter: 0 };

const view: viewFn = (dispatch, model) => {
    return div([
        div({ className: 'mv2' }, `Count: ${ model.counter }`),
        button({
            className: 'pv1 ph2 mr2',
            onclick: () => dispatch({ type: MESSAGES.ADD }),
        }, '+'),
        button({
            className: 'pv1 ph2',
            onclick: () => dispatch({ type: MESSAGES.SUBTRACT }),
        }, '-'),
    ]);
}

const update: updateFn = (message, model) => {
    switch (message.type) {
        case MESSAGES.ADD:
            return {
                ...model,
                counter: model.counter + 1
            } as State;
        case MESSAGES.SUBTRACT:
            return {
                ...model,
                counter: model.counter - 1
            } as State;
        default:
            return model;
    }
}

// impure code below

const app: appFn = (
    initModel,
    update,
    view,
    node
) => {
    let model = initModel;
    let currentView = view(dispatch, model);
    let rootNode = createElement(currentView) as Node;
    node.appendChild(rootNode);

    function dispatch(message: message): void {
        model = update(message, model);
        const updatedView = view(dispatch, model);
        const patches = diff(currentView, updatedView);
        rootNode = patch(rootNode as Element, patches);
        currentView = updatedView;
    }
};

const rootNode = document.getElementById('app') as HTMLElement;

app(initModel, update, view, rootNode);
