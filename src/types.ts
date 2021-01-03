export type message = { type: string, [key: string]: any };
export type dispatchFn = (message: message) => void;
