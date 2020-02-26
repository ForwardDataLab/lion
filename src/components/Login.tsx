import React, {useContext, useState} from "react";
import Axios from "axios";
import {Button, Container, Paper, TextField} from "@material-ui/core";
import {User} from "../models/User";
import {makeStyles} from "@material-ui/core/styles";
import {globalStore, SET_USER} from "../store/globalState";

const whiteSpaceRegex = /^\s*$/;

const loginStyles = makeStyles({
    paper: {
        padding: '2rem'
    },
    title: {
        color: '#212121',
        margin: '0 0 2rem 0'
    },
    form: {
        display: 'flex',
        flexDirection: 'column'
    },
    fieldSeparation: {
        marginBottom: '1rem'
    },
    functionalitySeparation: {
        marginBottom: '2rem'
    }
});

export function Login() {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUserNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const {dispatch} = useContext(globalStore);

    const styles = loginStyles();

    const onUpdateUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserName(e.target.value);
    };
    const onUpdateUserPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };
    const onSubmitForm = async () => {
        if (username.match(whiteSpaceRegex)) {
            setUserNameError('Username cannot be empty');
        } else if (password.match(whiteSpaceRegex)) {
            setPasswordError('Password cannot be empty');
        } else {
            try {
                // todo: submit login credential
                const response = await Axios({
                    url: '/login',
                    method: "POST",
                    timeout: 5000,
                    data: {
                        name: username,
                        password: password
                    }
                });
                const data = response.data;
                const status = response.status;
            } catch (e) {
                // todo: handle post responses
                console.error(e)
            }
            dispatch({type: SET_USER, payload: new User('MockUser', true)});
        }
    };

    return (
        <div style={{padding: `5em`}}>
            <Container maxWidth={'sm'}>
                <Paper className={styles.paper}>
                    <h1 className={styles.title}>Login</h1>
                    <form className={styles.form} noValidate>
                        <TextField
                            error={usernameError !== ''}
                            color={'secondary'}
                            className={styles.fieldSeparation}
                            id="standard-basic"
                            label={'username'}
                            helperText={usernameError}
                            onChange={onUpdateUserName}
                        />
                        <TextField
                            error={passwordError !== ''}
                            color={'secondary'}
                            className={styles.functionalitySeparation}
                            id="standard-basic"
                            label={'password'}
                            type={'password'}
                            helperText={passwordError}
                            onChange={onUpdateUserPassword}
                        />
                        <Button color={'secondary'} variant="contained" onClick={onSubmitForm}>SUBMIT</Button>
                    </form>
                </Paper>
            </Container>
        </div>
    )
}