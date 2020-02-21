import React, {Component} from "react";
import Axios from "axios";
import {Button, Paper, TextField} from "@material-ui/core";
import {User} from "../models/user";

const whiteSpaceRegex = /^\s*$/;

export interface LoginProps {
    updateUserInfo(user: User): any;
}

export class Login extends Component<LoginProps> {
    state = {
        username: '',
        password: '',
        usernameErrorText: '',
        passwordErrorText: ''
    };
    onUpdateUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({...this.state, username: e.target.value});
    };
    onUpdateUserPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({...this.state, password: e.target.value});
    };
    onSubmitForm = async () => {
        if (this.state.username.match(whiteSpaceRegex)) {
            this.setState({...this.state, usernameErrorText: 'Username cannot be empty'});
        } else if (this.state.password.match(whiteSpaceRegex)) {
            this.setState({...this.state, passwordErrorText: 'Password cannot be empty'});
        } else {
            // todo: submit login credential
            const response = await Axios({
                url: '/login',
                method: "POST",
                timeout: 5000,
                data: {
                    name: this.state.username,
                    password: this.state.password
                }
            });
            const data = response.data;
            const status = response.status;
            // todo: handle post responses
            this.props.updateUserInfo(new User('MockUser', true));
        }
    };
    render() {
        return (
            <div style={{padding: `5em`}}>
                <Paper>
                    <form noValidate>
                        <h1>Login</h1>
                        <TextField id="standard-basic" label={'username'} onChange={this.onUpdateUserName}/>
                        <TextField  id="standard-basic" label={'password'} type={'password'} onChange={this.onUpdateUserPassword}/>
                        <Button variant="contained" onClick={this.onSubmitForm}>SUBMIT</Button>
                    </form>
                </Paper>
            </div>
        )
    }
}