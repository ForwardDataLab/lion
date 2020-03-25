import React, {createContext, Dispatch, ReactNode, useReducer} from "react";
import {User} from "../models/User";

interface State {
    user: User | null;
}

interface Action {
    type: string;
    payload: User | null;
}

interface ContextProps {
    state: State,
    dispatch: Dispatch<Action>;
}

export const SET_USER = 'SET_USER';
export const REMOVE_USER = 'REMOVE_USER';
export const globalStore = createContext<ContextProps>({
    state: {user: null}, dispatch: () => {
    }
});
const {Provider} = globalStore;
const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                user: action.payload
            };
        case REMOVE_USER:
            return {
                user: null
            };
        default:
            throw new Error();
    }
};

const initialState: State = {
    user: null
};
export const GlobalStateProvider = ({children}: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (<Provider value={{state, dispatch}}>{children}</Provider>);
};