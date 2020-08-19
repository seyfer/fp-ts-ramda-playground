import initModel from './Model';
import update from './Update';
import view from './View';
import app from './App';

const node = document.getElementById('app') as HTMLElement;

app(initModel, update, view, node);
