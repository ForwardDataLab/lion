import React, {useState} from 'react';
import {Button, Checkbox, FormControlLabel, Grid, TextField} from "@material-ui/core";
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import {serverStyles} from "../../../styles/serverStyle";
import clsx from "clsx";
import {Redirect} from 'react-router-dom';
import {routerEndpoints} from "../../endpoints/routerEndpoints";
import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined';
import {ServerCreateProps, ServerEditOption, ServerEditProps} from "../../../types/props/ServerProps";
import {isBlank} from "../../utils/commonMethods";


function isEdit(props: ServerCreateProps | ServerEditProps): props is ServerEditProps {
    return 'server' in props;
}

function shouldShowError(str: string) {
    return !(str === '');
}

function getErrorHelperText(str: string) {
    return shouldShowError(str) ? str : ' ';
}

export function ServerEdit(props: ServerCreateProps | ServerEditProps) {

    const [name, setName] = useState(isEdit(props) ? props.server.name : '');
    const [url, setUrl] = useState(isEdit(props) ? props.server.url : '');
    const [slug, setSlug] = useState(isEdit(props) ? props.server.slug : '');
    const [description, setDescription] = useState(isEdit(props) ? props.server.description : '');
    const [requireAuthentication, setRequireAuthentication] = useState(isEdit(props) ? props.server.requireAuthentication : false);
    const [requireAuthorization, setRequireAuthorization] = useState(isEdit(props) ? props.server.requireAuthorization : false);

    const [nameInvalidMessage, setNameInvalidMessage] = useState('');
    const [urlInvalidMessage, setUrlInvalidMessage] = useState('');
    const [slugInvalidMessage, setSlugInvalidMessage] = useState('');
    const [descriptionInvalidMessage, setDescriptionInvalidMessage] = useState('');

    const [option, setOption] = useState(ServerEditOption.NONE);

    const isNameInvalid = isBlank;
    const isUrlInvalid = isBlank;
    const isSlugInvalid = isBlank;
    const isDescriptionInvalid = isBlank;

    const onUpdateName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };
    const onUpdateUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
    };
    const onUpdateSlug = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSlug(e.target.value);
    };
    const onUpdateDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value);
    };
    const onUpdateAuthentication = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRequireAuthentication(e.target.checked);
    };
    const onUpdateAuthorization = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRequireAuthorization(e.target.checked);
    };

    const onValidateInput = () => {
        const errorMessage = 'This field cannot be empty';
        const emptyMessage = '';
        // todo: perform server-side verification here
        let isInvalid = true;
        if (isNameInvalid(name)) {
            setNameInvalidMessage(errorMessage);
            isInvalid = false;
        } else {
            setNameInvalidMessage(emptyMessage);
        }
        if (isUrlInvalid(url)) {
            setUrlInvalidMessage(errorMessage);
            isInvalid = false;
        } else {
            setUrlInvalidMessage(emptyMessage);
        }
        if (isSlugInvalid(slug)) {
            setSlugInvalidMessage(errorMessage);
            isInvalid = false;
        } else {
            setSlugInvalidMessage(emptyMessage);
        }
        if (isDescriptionInvalid(description)) {
            setDescriptionInvalidMessage(errorMessage);
            isInvalid = false;
        } else {
            setDescriptionInvalidMessage(emptyMessage);
        }
        return isInvalid;
    };

    const onSaveConfig = () => {
        if (!onValidateInput()) {
            return;
        }
        props.onSave({
            name, url, slug, description, requireAuthentication, requireAuthorization
        });
        setOption(ServerEditOption.SAVE);
    };
    const onDeleteConfig = () => {
        if (isEdit(props)) {
            setOption(ServerEditOption.DELETE);
            props.onDelete(props.server);
        }
    };
    const onDiscardChange = () => {
        setOption(ServerEditOption.BACK);
    };

    const styles = serverStyles();
    const editForm = (
        <div>
            <h1 className={styles.titleStyle}>{isEdit(props) ? 'Edit' : 'Create'} Server Configuration</h1>
            <form className={styles.form}>
                <Grid container spacing={4}>
                    <Grid item xs={6}>
                        <TextField
                            required
                            error={shouldShowError(nameInvalidMessage)}
                            helperText={getErrorHelperText(nameInvalidMessage)}
                            color={'secondary'}
                            id="standard-required"
                            label="Server Name"
                            defaultValue={name}
                            onChange={onUpdateName}/>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            required
                            error={shouldShowError(slugInvalidMessage)}
                            helperText={getErrorHelperText(slugInvalidMessage)}
                            color={'secondary'}
                            id="standard-required"
                            label="Server Slug"
                            defaultValue={slug}
                            onChange={onUpdateSlug}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            color={'secondary'}
                            id="standard-required"
                            label="Server URL"
                            error={shouldShowError(urlInvalidMessage)}
                            helperText={getErrorHelperText(urlInvalidMessage)}
                            defaultValue={url}
                            onChange={onUpdateUrl}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color={'secondary'}
                                    checked={requireAuthentication}
                                    onChange={onUpdateAuthentication}
                                />
                            }
                            label={'Require Authentication'}
                            labelPlacement="end"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color={'secondary'}
                                    checked={requireAuthorization}
                                    onChange={onUpdateAuthorization}
                                />
                            }
                            label={'Require Authorization'}
                            labelPlacement="end"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            multiline
                            fullWidth
                            id="standard-multiline-flexible"
                            label="Server Description"
                            color={'secondary'}
                            error={shouldShowError(descriptionInvalidMessage)}
                            helperText={getErrorHelperText(descriptionInvalidMessage)}
                            value={description}
                            onChange={onUpdateDescription}
                        />
                    </Grid>
                </Grid>
            </form>

            <div className={styles.buttonWrapper}>
                <Button
                    color="secondary"
                    className={styles.buttonRightGap}
                    startIcon={<ArrowBackOutlinedIcon/>}
                    onClick={onDiscardChange}>
                    Back
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<SaveOutlinedIcon/>}
                    onClick={onSaveConfig}>
                    Save
                </Button>
                {
                    isEdit(props) && (
                        <Button
                            className={clsx(styles.buttonRightEnd, styles.errorButton)}
                            variant="contained"
                            color="secondary"
                            startIcon={<DeleteOutlineOutlinedIcon/>}
                            onClick={onDeleteConfig}>
                            Delete Server
                        </Button>
                    )
                }
            </div>
        </div>
    );

    if (option === ServerEditOption.NONE) {
        return editForm;
    } else {
        return <Redirect to={routerEndpoints.servers.url}/>;
    }
}