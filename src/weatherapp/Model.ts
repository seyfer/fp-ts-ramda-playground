export interface Location {
    id: number,
    name: string,
    temp: string,
    low: string,
    high: string,
}

export interface State {
    location: string,
    nextId: number,
    locations: Array<Location>,
    error: null | string,
}

const initModel: State = {
    location: '',
    nextId: 0,
    locations: [],
    error: null,
};

export default initModel;
