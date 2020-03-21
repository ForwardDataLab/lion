import React, {ReactNode, useEffect, useState} from "react";
import {ViewCommonProps} from "../../types/props/ViewProps";
import {QueryGeneral, QuerySchedule} from "../../models/Query";
import {routerEndpoints} from "../endpoints/routerEndpoints";
import {ServerRouteParams} from "../../types/props/ServerProps";
import {Button, Snackbar} from "@material-ui/core";
import {QueryList} from "./queries/QueryList";
import {useParams} from "react-router-dom";
import {QueryHistory} from "./queries/QueryHistory";
import {SnackBarTransition} from "../utils/commonComponents";
import {QueryCreate} from "./queries/QueryCreate";

export enum QueryRouteType {
    LIST, NEW, HISTORY
}

enum QueryUpdateType {
    ADD, DELETE
}

interface QueryUpdateRequest {
    type: QueryUpdateType,
    data: QueryGeneral,
}

interface QueryUpdateResult {
    isSuccess: boolean,
    errorMessage: null | string,
}

interface QueryProps extends ViewCommonProps {
    routeType: QueryRouteType
}

const fakeQueries: QueryGeneral[] = [
    {
        name: 'tetris',
        source: 'Reddit',
        schedule: QuerySchedule.AD_HOC
    }, {
        name: 'ball',
        source: 'Twitter',
        schedule: QuerySchedule.PER_DAY
    }
];

// todo: spreadsheet like; nested lists

export function QueryManagement(props: QueryProps) {
    const {updateTitle} = props;
    // const {state} = useContext(globalStore);
    const paramName = useParams<ServerRouteParams>()[routerEndpoints.queries.history.paramName];
    const [queries, setQueries] = useState([] as QueryGeneral[]);
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        updateTitle(routerEndpoints.queries.name);
    }, [updateTitle]);
    useEffect(() => {
        // todo: fetch queries here
        setQueries(fakeQueries)
    }, [setQueries]);

    const onUpdateQueries = async (request: QueryUpdateRequest) => {
        // todo: make http requests
        const result: QueryUpdateResult = {
            isSuccess: true,
            errorMessage: null
        };
        // todo: can fetch brand new data from server
        if (result.isSuccess) {
            const newQueries: QueryGeneral[] = queries.slice(0);
            switch (request.type) {
                case QueryUpdateType.DELETE: {
                    const i = newQueries.findIndex((s: QueryGeneral) => s.name === request.data.name);
                    if (i < 0) {
                        throw new Error('Server names should be unique');
                    }
                    newQueries.splice(i, 1);
                    break;
                }
                case QueryUpdateType.ADD: {
                    newQueries.unshift(request.data);
                    break
                }
                default:
                    throw new Error('Invalid update type');
            }
            setQueries(newQueries);
            setAlertMessage('Update servers successful');
        } else {
            setAlertMessage('Error: ' + result.errorMessage ?? 'Fail to modify servers');
        }
    };

    const onPerformDelete = (query: QueryGeneral) => onUpdateQueries({data: query, type: QueryUpdateType.DELETE});
    const onPerformAdd = (query: QueryGeneral) => onUpdateQueries({data: query, type: QueryUpdateType.ADD});

    const onCloseSnackBar = () => setAlertMessage('');

    let child: ReactNode;
    switch (props.routeType) {
        case QueryRouteType.LIST: {
            child = <QueryList queries={queries}/>;
            break;
        }
        case QueryRouteType.NEW: {
            child = null;
            child = <QueryCreate addQuery={onPerformAdd}/>;
            break;
        }
        case QueryRouteType.HISTORY: {
            child = <QueryHistory/>;
            break;
        }
        default:
            throw new Error('Invalid Queries Management Enum Prop');
    }
    return (
        <div>
            <div>{child}</div>
            <Snackbar
                open={alertMessage !== '' && alertMessage != null}
                TransitionComponent={SnackBarTransition}
                message={alertMessage}
                action={<Button color="secondary" size="small" onClick={onCloseSnackBar}>Close</Button>}
            />
        </div>
    );

    return (<div/>);
}