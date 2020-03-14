import React, {useEffect, useState} from "react";
import {QueryGeneral, QuerySchedule} from "../../../models/Query";
import {JSONObject} from "../../../types/Json";
import fakeSchema from "../../../data/fakeSchema1.json";
import {isBlank} from "../../utils/commonMethods";
import {Button, FormControl, Grid, InputLabel, MenuItem, Select, Snackbar, TextField} from "@material-ui/core";
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import {SnackBarTransition} from "../../utils/commonComponents";
import {queryCreateStyles} from "../../../styles/queryStyle";
import {PathsTree, QuerySchemaViz} from "./QuerySchemaViz";


// todo: query request structure is not reasonable, may be more efficient, but need rework at the backend

interface QueryCreateProps {
    addQuery(query: QueryGeneral): void;
}

const fakeSources = ['Reddit', 'GitHub'];

const allSchedules = [
    QuerySchedule.AD_HOC, QuerySchedule.PER_MINUTE, QuerySchedule.PER_HOUR,
    QuerySchedule.PER_DAY, QuerySchedule.PER_WEEK, QuerySchedule.PER_MONTH
];

export function QueryCreate(props: QueryCreateProps) {
    const [fullSchema, setFullSchema] = useState({} as JSONObject);
    const [allSources, setAllSources] = useState([] as string[]);
    const [name, setName] = useState('');
    const [source, setSource] = useState(allSources[0]);
    const [schedule, setSchedule] = useState<QuerySchedule>(allSchedules[0]);
    const [schema, setSchema] = useState({} as PathsTree);
    const [nameErrorMessage, setNameErrorMessage] = useState<string | null>(null);
    const [schemaErrorMessage, setSchemaErrorMessge] = useState<string | null>(null);
    useEffect(() => {
        // todo: retrieve schema here
        (async () => {
            setFullSchema(fakeSchema);
        })();
    }, [setFullSchema]);
    useEffect(() => {
        // todo: retrieve all available sources here
        (async () => {
            setAllSources(fakeSources);
        })();
    }, [setAllSources]);

    const styles = queryCreateStyles();

    const onUpdateName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };
    const onUpdateSource = (e: React.ChangeEvent<{ value: unknown }>) => {
        setSource(e.target.value as string);
    };
    const onUpdateSchedule = (e: React.ChangeEvent<{ value: unknown }>) => {
        setSchedule(e.target.value as QuerySchedule);
    };
    const onValidateName = () => !isBlank(name);
    const onValidateSchema = () => schema != null;
    const onSaveQuery = () => {
        if (!onValidateName()) {
            setNameErrorMessage('Name cannot be empty');
            return;
        }
        if (!onValidateSchema()) {
            setNameErrorMessage('Schema cannot be empty');
            return;
        }
        console.log(schema);

        // todo: submit save request here
        props.addQuery({
            name, source, schedule
        });
    };
    const onCloseSnackBar = () => setSchemaErrorMessge(null);
    const shouldShowError = nameErrorMessage != null && nameErrorMessage !== '';

    const basicForm = (
        <div>
            <h1 className={styles.titleStyle}>Basic Information</h1>
            <form className={styles.form}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            required
                            fullWidth
                            error={shouldShowError}
                            id="standard-basic"
                            label="Query Name"
                            color={'secondary'}
                            helperText={shouldShowError ? nameErrorMessage : ' '}
                            onChange={onUpdateName}
                            value={name}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl color={'secondary'} fullWidth required>
                            <InputLabel id="select-source-label">Source</InputLabel>
                            <Select
                                labelId="select-source-label"
                                value={source}
                                onChange={onUpdateSource}>
                                {
                                    allSources.map(source => (<MenuItem key={source} value={source}>{source}</MenuItem>))
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl color={'secondary'} fullWidth>
                            <InputLabel id="select-schedule-label">Schedules</InputLabel>
                            <Select
                                labelId="select-schedule-label"
                                value={schedule}
                                onChange={onUpdateSchedule}>
                                {
                                    allSchedules.map(schedule => (<MenuItem key={schedule} value={schedule}>{schedule}</MenuItem>))
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </form>
        </div>
    );

    const visualization = (
        <div>
            <h1 className={styles.titleStyle}>Configure Query</h1>
            <QuerySchemaViz rawSchema={fakeSchema} setQuerySchema={setSchema}/>
        </div>
    );
    return (<div>
        {basicForm}
        <br/>
        {visualization}
        <br/>
        <div className={styles.buttonWrapper}>
            <Button
                color="secondary"
                className={styles.buttonRightGap}
                startIcon={<SaveOutlinedIcon/>}
                onClick={onSaveQuery}>
                Save
            </Button>
        </div>
        <Snackbar
            open={schemaErrorMessage !== '' && schemaErrorMessage != null}
            TransitionComponent={SnackBarTransition}
            message={schemaErrorMessage}
            action={<Button color="secondary" size="small" onClick={onCloseSnackBar}>Close</Button>}
        />
    </div>);
}