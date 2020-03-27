import React, {useState} from "react";
import {Application} from "../../../models/Application";
import {Button, Container, Grid, TextField} from "@material-ui/core";
import {applicationStyles} from "../../../styles/applicationStyle";
import clsx from "clsx";
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import SystemUpdateAltOutlinedIcon from '@material-ui/icons/SystemUpdateAltOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';

type StringDict = { [name: string]: string };

interface ApplicationCreateProps {
    existingApplication: Application | null,

    onCreate(application: Application): void,

    onUpdate(application: Application): void,

    onDelete(application: Application): void
}

function getStringOrDefault(candidate: string | undefined) {
    return candidate ? (candidate as string) : '';
}

function getBoolean(candidate: string | undefined) {
    return !!(candidate as any)
}

function isStringEmpty(candidate: string | undefined) {
    if (candidate == null) {
        return false
    }
    return candidate.trim() === '';
}

export function ApplicationCreate(props: ApplicationCreateProps) {
    const [values, setValues] = useState<StringDict>(
        props.existingApplication ? (props.existingApplication as StringDict) : {}
        );
    const [errorMessages, setErrorMessages] = useState<StringDict>({});
    const styles = applicationStyles();

    const onChangeValues = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
        const value = e.target.value as string;
        setValues((oldValues: StringDict) => ({...oldValues, [key]: value}));
    };
    const onVerifyForm = () => {
        let isError = false;
        if (isStringEmpty(values['name'])) {
            setErrorMessages(oldMessages => ({...oldMessages, name: 'Name must not be empty'}));
            isError = true;
        }
        if (isStringEmpty(values['callbackURL'])) {
            setErrorMessages(oldMessages => ({...oldMessages, callbackURL: 'callbackURL must not be empty'}));
            isError = true;
        }
        if (isStringEmpty(values['home'])) {
            setErrorMessages(oldMessage => ({...oldMessage, home: 'Home must not be empty'}));
            isError = true;
        }
        if (isError) {
            return false;
        }
        setErrorMessages({});
        return true;
    };
    const onCreateNew = () => {
        if (!onVerifyForm()) {
            return;
        }
        props.onCreate(values as Application);
    };
    const onUpdateExisting = () => {
        if (!onVerifyForm()) {
            return;
        }
        props.onUpdate(values as Application);
    };
    const onDeleteExisting = () => {
        props.onDelete(values as Application);
    };

    let buttons;
    if (props.existingApplication) {
        buttons = (
            <div className={clsx(styles.submitButtonWrapper, styles.buttonWrapper)}>
                <Button
                    variant={'contained'}
                    color={'secondary'}
                    onClick={onUpdateExisting}
                    startIcon={<SystemUpdateAltOutlinedIcon/>}
                >
                    Update Application
                </Button>
                <Button
                    className={clsx(styles.buttonRightEnd, styles.errorButton)}
                    variant={'contained'}
                    onClick={onDeleteExisting}
                    startIcon={<DeleteOutlineOutlinedIcon/>}
                >
                    Delete Application
                </Button>
            </div>
        );
    } else {
        buttons = (
            <div className={clsx(styles.submitButtonWrapper, styles.buttonWrapper)}>
                <Button
                    variant={'contained'}
                    color={'secondary'}
                    onClick={onCreateNew}
                    startIcon={<SaveOutlinedIcon/>}
                >
                    Save Application
                </Button>
            </div>
        );
    }
    return (
        <div>
            <h1 className={styles.titleStyle}>
                {
                    props.existingApplication ? 'Edit Application' : 'Create Application'
                }
            </h1>
            <Container className={styles.form} disableGutters={true} maxWidth={'sm'}>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            color={'secondary'}
                            value={getStringOrDefault(values['name'])}
                            label={'Name'}
                            error={getBoolean(errorMessages['name'])}
                            helperText={getStringOrDefault(errorMessages['name'])}
                            onChange={e => onChangeValues(e, 'name')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            color={'secondary'}
                            value={getStringOrDefault(values['callbackURL'])}
                            label={'Callback URL'}
                            error={getBoolean(errorMessages['callbackURL'])}
                            helperText={getStringOrDefault(errorMessages['callbackURL'])}
                            onChange={e => onChangeValues(e, 'callbackURL')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            color={'secondary'}
                            value={getStringOrDefault(values['home'])}
                            label={'Home'}
                            error={getBoolean(errorMessages['home'])}
                            helperText={getStringOrDefault(errorMessages['home'])}
                            onChange={e => onChangeValues(e, 'home')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            multiline
                            fullWidth
                            color={'secondary'}
                            value={getStringOrDefault(values['description'])}
                            label={'Description'}
                            error={getBoolean(errorMessages['description'])}
                            helperText={getStringOrDefault(errorMessages['description'])}
                            onChange={e => onChangeValues(e, 'description')}
                        />
                    </Grid>
                </Grid>
                {buttons}
            </Container>
        </div>
    )
}