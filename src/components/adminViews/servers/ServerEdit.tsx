import React, {useState} from 'react';
import {Server} from "../../../types/Server";
import {Button, Checkbox, FormControlLabel, Grid, TextField} from "@material-ui/core";
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import {serverStyles} from "../../../styles/servers";


interface ServerCreateProps {
    onSave(server: Server): void,
}

interface ServerEditProps extends ServerCreateProps {
    server: Server,

    onDelete(server: Server): void,
}


function isEdit(props: ServerCreateProps | ServerEditProps): props is ServerEditProps {
    return 'server' in props;
}

export function ServerEdit(props: ServerCreateProps | ServerEditProps) {

    const [name, setName] = useState(isEdit(props) ? props.server.name : '');
    const [url, setUrl] = useState(isEdit(props) ? props.server.url : '');
    const [slug, setSlug] = useState(isEdit(props) ? props.server.slug : '');
    const [description, setDescription] = useState(isEdit(props) ? props.server.description : '');
    const [requireAuthentication, setRequireAuthentication] = useState(isEdit(props) ? props.server.requireAuthentication : false);
    const [requireAuthorization, setRequireAuthorization] = useState(isEdit(props) ? props.server.requireAuthorization : false);

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

    const onSaveConfig = () => {
        props.onSave({
            name, url, slug, description, requireAuthentication, requireAuthorization
        });
    };
    const onDeleteConfig = () => {
        if (isEdit(props)) {
            props.onDelete({
                name, url, slug, description, requireAuthentication, requireAuthorization
            });
        }
    };

    const styles = serverStyles();
    return (
        <div>
            <h1 className={styles.titleStyle}>{isEdit(props) ? 'Edit' : 'Create'} Server Configuration</h1>
            <form className={styles.form}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            required
                            id="standard-required"
                            label="Server Name"
                            defaultValue={name}
                            onChange={onUpdateName}/>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            required
                            id="standard-required"
                            label="Server Slug"
                            defaultValue={slug}
                            onChange={onUpdateSlug}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="standard-required"
                            label="Server URL"
                            defaultValue={url}
                            onChange={onUpdateUrl}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    required
                                    color={'secondary'}
                                    checked={requireAuthentication}
                                    onChange={onUpdateAuthentication}
                                />
                            }
                            label={'Require Authentication'}
                            labelPlacement="start"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    required
                                    color={'secondary'}
                                    checked={requireAuthorization}
                                    onChange={onUpdateAuthorization}
                                />
                            }
                            label={'Require Authorization'}
                            labelPlacement="start"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="standard-multiline-flexible"
                            label="Server Description"
                            multiline
                            rowsMax="4"
                            value={description}
                            onChange={onUpdateDescription}
                        />
                    </Grid>
                </Grid>
            </form>

            <div className={styles.buttonWrapper}>
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
                            className={styles.buttonRightEnd}
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
}