import * as R from 'ramda';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { Location, State } from "./Model";

export type message = { type: string, [key: string]: any };
export type updateFn = (message: message, model: State) => unknown;

export interface HttpCommand {
    request: AxiosRequestConfig,
    successMsg: (response: AxiosResponse) => { type: string, id: number, response: AxiosResponse },
    errorMsg: (error: AxiosError) => { type: string, error: AxiosError<any> },
}

export const MSGS = {
    LOCATION_INPUT: 'LOCATION_INPUT',
    ADD_LOCATION: 'ADD_LOCATION',
    REMOVE_LOCATION: 'REMOVE_LOCATION',
    HTTP_SUCCESS: 'HTTP_SUCCESS',
    HTTP_ERROR: 'HTTP_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR',
};

const APPID = '98baa908d5b96e101af37a359fe39bb3';

function weatherUrl(city: string) {
    return `http://api.openweathermap.org/data/2.5/weather?q=${ encodeURI(
        city,
    ) }&units=imperial&APPID=${ APPID }`;
}

export function locationInputMsg(locationName: string) {
    return {
        type: MSGS.LOCATION_INPUT,
        location: locationName,
    };
}

export const addLocationMsg = {
    type: MSGS.ADD_LOCATION,
};

export function removeLocationMsg(id: number) {
    return {
        type: MSGS.REMOVE_LOCATION,
        id,
    };
}

const httpSuccessMsg = R.curry((id: number, response: AxiosResponse): { type: string, id: number, response: AxiosResponse } => ({
    type: MSGS.HTTP_SUCCESS,
    id,
    response,
}));

function httpErrorMsg(error: AxiosError) {
    return {
        type: MSGS.HTTP_ERROR,
        error,
    };
}

export const clearErrorMsg = {
    type: MSGS.CLEAR_ERROR,
};

function FtoC(temp: number) {
    return 5 / 9 * (temp - 32);
}

const parseInt10 = (value: string) => parseInt(value, 10);

const update: updateFn = function (message, model) {
    switch (message.type) {
        case MSGS.LOCATION_INPUT: {
            const { location } = message;
            return { ...model, location } as State;
        }
        case MSGS.ADD_LOCATION: {
            const { nextId, location, locations } = model;
            const newLocation: Location = {
                id: nextId,
                name: location,
                temp: '?',
                low: '?',
                high: '?',
            };
            const updatedLocations = R.prepend(newLocation, locations);
            return [
                {
                    ...model,
                    location: '',
                    locations: updatedLocations,
                    nextId: nextId + 1,
                } as State,
                {
                    request: { url: weatherUrl(location) },
                    successMsg: httpSuccessMsg(nextId),
                    errorMsg: httpErrorMsg,
                } as HttpCommand,
            ];
        }
        case MSGS.REMOVE_LOCATION: {
            const { id } = message;
            const { locations } = model;
            const updatedLocations = R.reject(R.propEq('id', id), locations);
            return { ...model, locations: updatedLocations } as State;
        }
        case MSGS.HTTP_SUCCESS: {
            const { id, response } = message;
            const { locations } = model;
            const { temp, temp_min, temp_max } = R.pathOr(
                { temp: '?', temp_min: '?', temp_max: '?' },
                ['data', 'main'],
                response,
            );
            const updatedLocations = R.map(location => {
                if (location.id === id) {
                    return {
                        ...location,
                        temp: Math.round(FtoC(parseInt10(temp))).toString(),
                        low: Math.round(FtoC(parseInt10(temp_min))).toString(),
                        high: Math.round(FtoC(parseInt10(temp_max))).toString(),
                    } as Location;
                }
                return location;
            }, locations);
            return {
                ...model,
                locations: updatedLocations,
            } as State;
        }
        case MSGS.HTTP_ERROR: {
            const { error } = message;
            return { ...model, error: error.message } as State;
        }
        case MSGS.CLEAR_ERROR: {
            return { ...model, error: null } as State;
        }
    }
    return model;
}

export default update;
