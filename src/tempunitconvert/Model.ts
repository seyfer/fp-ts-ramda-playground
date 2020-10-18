export type temperatureUnit = 'Celsius' | 'Fahrenheit' | 'Kelvin';

export interface State {
    leftValue: string,
    leftUnit: temperatureUnit,
    rightValue: string,
    rightUnit: temperatureUnit,
    sourceLeft: boolean,
}

const initModel: State = {
    leftValue: '0',
    leftUnit: 'Celsius',
    rightValue: '32',
    rightUnit: 'Fahrenheit',
    sourceLeft: true,
};

export default initModel;
