import { diff, patch } from 'virtual-dom';
import createElement from 'virtual-dom/create-element';
import { State } from "./Model";
import { updateFn } from "./Update";
import { viewFn } from "./View";
import { message } from "../types";

type appFn = (
    initModel: State,
    update: updateFn,
    view: viewFn,
    node: HTMLElement
) => void;

const app: appFn = (initModel, update, view, node) => {
    let model = initModel;
    let currentView = view(dispatch, model);
    let rootNode = createElement(currentView);
    node.appendChild(rootNode);

    function dispatch(message: message) {
        model = update(message, model);
        const updatedView = view(dispatch, model);
        const patches = diff(currentView, updatedView);
        rootNode = patch(rootNode, patches);
        currentView = updatedView;
    }
}

export default app;
