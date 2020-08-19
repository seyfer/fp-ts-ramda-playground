import {diff, patch} from 'virtual-dom';
import createElement from 'virtual-dom/create-element';
import {State} from "./Model";
import {message, updateFn} from "./Update";
import {viewFn} from "./View";

type appFn = (
    initModel: State,
    update: updateFn,
    view: viewFn,
    node: HTMLElement
) => void;

const app: appFn = function app(initModel, update, view, node) {
    let model = initModel;
    let currentView = view(dispatch, model);
    let rootNode = createElement(currentView) as Node;
    node.appendChild(rootNode);

    function dispatch(message: message) {
        model = update(message, model);
        const updatedView = view(dispatch, model);
        const patches = diff(currentView, updatedView);
        rootNode = patch(rootNode as Element, patches);
        currentView = updatedView;
    }
}

export default app;
