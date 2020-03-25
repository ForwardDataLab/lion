import React, {useState} from "react";
import {UserExtended} from "../../../models/User";
import {userStyles} from "../../../styles/userStyle";
import {Button, Checkbox, Container, FormControlLabel, Grid, TextField} from "@material-ui/core";
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import clsx from "clsx";


function isValidNumber(str: string) {
    let result = str.trim();
    if (result === '') {
        return false
    }
    if (!(/^[0-9,.]*$/.test(result))) {
        return false
    }
    return !isNaN(+result);
}

interface UserEditProps {
    user: UserExtended,

    onDelete(email: string): void,

    onSave(user: UserExtended): void
}

export function UserEdit(props: UserEditProps) {
    const [quota, setQuota] = useState(props.user.quota.toString());
    const [isAdmin, setIsAdmin] = useState(true);
    const [quotaErrorMessage, setQuotaErrorMessage] = useState('');
    const styles = userStyles();
    const onModifyQuota = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuota(e.target.value);
    };
    const onModifyAdmin = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsAdmin(e.target.checked);
    };
    const onVerifyForm = () => {
        if (!isValidNumber(quota)) {
            setQuotaErrorMessage('Input must be a number');
            return false
        }
        // todo: send user here
        return true
    };
    const onSubmit = () => {
        if (!onVerifyForm()) {
            return
        }
        const numericQuota = +quota;
        props.onSave({...props.user, quota: numericQuota});
    };
    const onDiscard = () => {
        // todo: send request here
        props.onDelete(props.user.email);
    };
    return (
        <div>
            <h1 className={styles.titleStyle}>Edit User</h1>
            <small className={styles.helperTextStyle}>For quota, Please enter a decimal number; a number with more than
                3 digits after the decimal point will be truncated</small>
            <Container className={styles.formContainer} disableGutters={true} maxWidth={"md"}>
                <Grid container spacing={4}>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            disabled
                            color={'secondary'}
                            label={"Name"}
                            value={props.user.name}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            disabled
                            fullWidth
                            color={'secondary'}
                            label={"Email Address"}
                            value={props.user.email}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            required
                            fullWidth
                            color={'secondary'}
                            label={"Quota Limit"}
                            value={quota}
                            error={!!(quotaErrorMessage as any)}
                            onChange={onModifyQuota}
                            helperText={(quotaErrorMessage as any) ?? ''}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isAdmin}
                                    color={'secondary'}
                                    onChange={onModifyAdmin}
                                />
                            }
                            label={'Is administrator access granted'}
                        />
                    </Grid>
                </Grid>

                <div className={clsx(styles.buttonWrapper, styles.buttons)}>
                    <Button
                        variant={'contained'}
                        color={'secondary'}
                        startIcon={<SaveOutlinedIcon/>}
                        onClick={onSubmit}
                    >
                        Save Configuration
                    </Button>
                    <Button
                        className={clsx(styles.errorButton, styles.buttonRightEnd)}
                        variant={'contained'}
                        startIcon={<DeleteOutlineOutlinedIcon/>}
                        onClick={onDiscard}
                    >
                        Delete User
                    </Button>
                </div>
            </Container>
        </div>
    )
}