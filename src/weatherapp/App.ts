import { diff, patch } from 'virtual-dom';
import createElement from 'virtual-dom/create-element';
import axios from 'axios';
import * as R from 'ramda';
import { State } from "./Model";
import { HttpCommand, message, updateFn } from "./Update";
import { dispatchFn, viewFn } from "./View";

type appFn = (
    initModel: State,
    update: updateFn,
    view: viewFn,
    node: HTMLElement
) => void;

const app: appFn = function app(initModel, update, view, node) {
    let model = initModel;
    let currentView = view(dispatch, model);
    let rootNode = createElement(currentView);
    node.appendChild(rootNode);

    function dispatch(message: message) {
        const updates = update(message, model);
        const isArray = R.type(updates) === 'Array';
        model = isArray ? (updates as [State, HttpCommand])[0] : updates as State;
        const command = isArray ? (updates as [State, HttpCommand])[1] : null;
        httpEffects(dispatch, command);
        const updatedView = view(dispatch, model);
        const patches = diff(currentView, updatedView);
        rootNode = patch(rootNode, patches);
        currentView = updatedView;
    }
}

function httpEffects(dispatch: dispatchFn, command: HttpCommand | null) {
    if (command === null) {
        return;
    }
    const { request, successMsg } = command;
    axios(request).then(response => dispatch(successMsg(response))).catch(e => console.error(e));
}

export default app;
