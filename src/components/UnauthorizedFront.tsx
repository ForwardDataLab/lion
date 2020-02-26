import {AppBar, Toolbar, Typography} from "@material-ui/core";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Login} from "./Login";
import React from "react";


export function UnauthorizedFront() {
    return (
        <Router>
            <div>
                <AppBar position="static">
                    <Toolbar variant="dense">
                        <Typography variant="h6">
                            Listen Online
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Switch>
                    <Route path={'/'}>
                        <Login/>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}