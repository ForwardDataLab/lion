import {FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField} from "@material-ui/core";
import React, {useCallback} from "react";
import {queryCreateStyles} from "../../../../styles/queryStyle";
import {QueryGeneral, QuerySchedule} from "../../../../models/Query";

export const allSchedules = [
    QuerySchedule.AD_HOC, QuerySchedule.PER_MINUTE, QuerySchedule.PER_HOUR,
    QuerySchedule.PER_DAY, QuerySchedule.PER_WEEK, QuerySchedule.PER_MONTH
];

export interface QueryCreateErrorMessage {
    name: string | null,
    source: string | null,
    schedule: string | null
}

export interface QueryCreateFormProps {
    errorMessages: QueryCreateErrorMessage,
    allSources: string[],
    query: QueryGeneral,

    onUpdateQuery(newQuery: QueryGeneral): void
}


export function QueryCreateForm(props: QueryCreateFormProps) {
    const {errorMessages, allSources, query, onUpdateQuery} = props;
    const styles = queryCreateStyles();
    const shouldShowNameError = errorMessages.name != null && errorMessages.name !== '';
    const shouldShowSourceError = errorMessages.source != null && errorMessages.source !== '';
    const onUpdateName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdateQuery({...query, name: e.target.value as string});
    }, [query, onUpdateQuery]);
    const onUpdateSource = useCallback((e: React.ChangeEvent<{ value: unknown }>) => {
        onUpdateQuery({...query, source: e.target.value as string});
    }, [query, onUpdateQuery]);
    const onUpdateSchedule = useCallback((e: React.ChangeEvent<{ value: unknown }>) => {
        onUpdateQuery({...query, schedule: e.target.value as QuerySchedule});
    }, [query, onUpdateQuery]);
    return (
        <div>
            <h1 className={styles.titleStyle}>Basic Information</h1>
            <form className={styles.form}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            required
                            fullWidth
                            error={shouldShowNameError}
                            id="standard-basic"
                            label="Query Name"
                            color={'secondary'}
                            helperText={shouldShowNameError ? errorMessages.name : ' '}
                            onChange={onUpdateName}
                            value={query.name}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl
                            color={'secondary'}
                            fullWidth
                            required
                            error={shouldShowSourceError}
                        >
                            <InputLabel id="select-source-label">Source</InputLabel>
                            <Select
                                labelId="select-source-label"
                                value={query.source}
                                onChange={onUpdateSource}>
                                {
                                    allSources.map(source => (
                                        <MenuItem key={source} value={source}>{source}</MenuItem>))
                                }
                            </Select>
                            <FormHelperText>{shouldShowSourceError ? errorMessages.source : ' '}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl color={'secondary'} fullWidth>
                            <InputLabel id="select-schedule-label">Schedules</InputLabel>
                            <Select
                                labelId="select-schedule-label"
                                value={query.schedule}
                                onChange={onUpdateSchedule}>
                                {
                                    allSchedules.map(schedule => (
                                        <MenuItem key={schedule} value={schedule}>{schedule}</MenuItem>))
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </form>
        </div>
    )
}