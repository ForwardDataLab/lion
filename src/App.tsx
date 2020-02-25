import React, {useState} from 'react';
import './App.css';
import {User} from "./models/user";
import {createMuiTheme} from '@material-ui/core';
import {ThemeProvider} from '@material-ui/core/styles';
import {AppTheme} from "./styles/theme";
import {UnauthorizedFront} from "./components/UnauthorizedFront";
import {AuthorizedFront} from "./components/AuthorizedFront";

function App() {
    const [user, setUser] = useState<User|null>(new User('here', true));

    const isLoggedIn = user != null;
    const $emptyMain = <UnauthorizedFront updateUser={(user => setUser(user))}/>;
    // todo: add logout
    const $fullMain = <AuthorizedFront user={user!}/>;
    return (
        <ThemeProvider theme={createMuiTheme(AppTheme)}>
            {isLoggedIn ? $fullMain : $emptyMain}
        </ThemeProvider>
    );
}

export default App;
