import { AxiosError, AxiosResponse } from "axios";

const axios = require('axios');

const APPID = '98baa908d5b96e101af37a359fe39bb3';

function weatherUrl(city: string) {
    return `http://api.openweathermap.org/data/2.5/weather?q=${ encodeURI(
        city,
    ) }&units=imperial&APPID=${ APPID }`;
}

const url = weatherUrl('Paris');
const request = { url };
const promise = axios(request);
promise.then(success, error);

function success(response: AxiosResponse) {
    console.log(JSON.stringify(response.data, null, 2));
}

function error(err: AxiosError) {
    console.log(JSON.stringify(err.response!.data, null, 2));
}
