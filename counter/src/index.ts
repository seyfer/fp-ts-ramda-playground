import hh from 'hyperscript-helpers';
import {diff, h, patch} from 'virtual-dom';
import createElement from 'virtual-dom/create-element';
import VNode = VirtualDOM.VNode;

type dispatchFn = (message: string) => void;
type viewFn = (dispatch: dispatchFn, model: number) => VNode;
type updateFn = (message: string, model: number) => number;
type appFn = (
    initModel: number,
    update: updateFn,
    view: viewFn,
    node: HTMLElement
) => void;

enum MESSAGES {
    ADD = 'ADD',
    SUBTRACT = 'SUBTRACT',
}

const {div, button} = hh(h);

const initModel = 0;

const view: viewFn = (dispatch, model) => {
    return div([
        div({className: 'mv2'}, `Count: ${model}`),
        button({
            className: 'pv1 ph2 mr2',
            onclick: () => dispatch(MESSAGES.ADD),
        }, '+'),
        button({
            className: 'pv1 ph2',
            onclick: () => dispatch(MESSAGES.SUBTRACT),
        }, '-'),
    ]);
}

const update: updateFn = (message, model) => {
    switch (message) {
        case MESSAGES.ADD:
            return model + 1;
        case MESSAGES.SUBTRACT:
            return model - 1;
        default:
            return model;
    }
}

// impure code below

const app: appFn = (
    initModel: number,
    update: updateFn,
    view: viewFn,
    node: HTMLElement
) => {
    let model = initModel;
    let currentView = view(dispatch, model);
    let rootNode = createElement(currentView) as Node;
    node.appendChild(rootNode);

    function dispatch(message: string): void {
        model = update(message, model);
        const updatedView = view(dispatch, model);
        const patches = diff(currentView, updatedView);
        rootNode = patch(rootNode as Element, patches);
        currentView = updatedView;
    }
};

const rootNode = document.getElementById('app') as HTMLElement;

app(initModel, update, view, rootNode);
