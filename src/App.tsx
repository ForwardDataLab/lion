import React, {useContext, useEffect} from 'react';
import './App.css';
import {createMuiTheme} from '@material-ui/core';
import {ThemeProvider} from '@material-ui/core/styles';
import {AppTheme} from "./styles/theme";
import {UnauthorizedFront} from "./components/UnauthorizedFront";
import {AuthorizedFront} from "./components/AuthorizedFront";
import {GlobalStateProvider, globalStore, SET_USER} from "./store/globalState";


function App() {
    const {state, dispatch} = useContext(globalStore);
    useEffect(() => {
        // todd: fetch data from localstorage here
        (async () => {
            console.log("App rendered");
            dispatch({type: SET_USER, payload: {userName: 'Start from App', isAdmin: true}});
        })();
    }, [dispatch]);
    const isLoggedIn = state.user != null;
    const $emptyMain = <UnauthorizedFront/>;
    // todo: add logout
    const $fullMain = <AuthorizedFront/>;
    return (
        <ThemeProvider theme={createMuiTheme(AppTheme)}>
            {isLoggedIn ? $fullMain : $emptyMain}
        </ThemeProvider>
    );
}

export default () => (
    <GlobalStateProvider>
        <App/>
    </GlobalStateProvider>
);
