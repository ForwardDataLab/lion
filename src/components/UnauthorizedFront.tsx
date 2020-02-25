import {AppBar, Toolbar, Typography} from "@material-ui/core";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Login} from "./Login";
import {User} from "../models/user";
import React from "react";

export interface unauthorizedFrontProps {
    updateUser(user: User): void;
}

export function UnauthorizedFront(props: unauthorizedFrontProps) {
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
                        <Login updateUserInfo={props.updateUser}/>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}