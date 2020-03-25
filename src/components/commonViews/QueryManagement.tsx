import React, {ReactNode, useEffect, useState} from "react";
import {ViewCommonProps} from "../../types/props/ViewProps";
import {QueryGeneral, QuerySchedule} from "../../models/Query";
import {routerEndpoints} from "../endpoints/routerEndpoints";
import {RouteParams} from "../../types/props/ServerProps";
import {Button, Snackbar} from "@material-ui/core";
import {QueryList} from "./queries/QueryList";
import {Redirect, useHistory, useParams} from "react-router-dom";
import {QueryHistory} from "./queries/QueryHistory";
import {SnackBarTransition} from "../utils/commonComponents";
import {QueryCreate} from "./queries/QueryCreate";
import {QueryUpdateRequest, QueryUpdateType} from "../../types/requests/queryRequests";
import {QueryUpdateResponse} from "../../types/responses/queryResponses";

export enum QueryRouteType {
    LIST, NEW, HISTORY
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

export function QueryManagement(props: QueryProps) {
    const {updateTitle} = props;
    // const {state} = useContext(globalStore);
    const selectedQueryName = useParams<RouteParams>()[routerEndpoints.users.edit.paramName];
    const [queries, setQueries] = useState<QueryGeneral[]>([]);
    const [alertMessage, setAlertMessage] = useState('');
    const history = useHistory();

    useEffect(() => {
        updateTitle(routerEndpoints.queries.name);
    }, [updateTitle]);
    useEffect(() => {
        // todo: fetch queries here
        setQueries(fakeQueries)
    }, [setQueries]);

    const onUpdateQueries = async (request: QueryUpdateRequest) => {
        // todo: make http requests
        const result: QueryUpdateResponse = {
            data: null,
            errors: []
        };
        // todo: can fetch brand new data from server
        if (result.errors.length === 0) {
            setQueries((queries: QueryGeneral[]) => {
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
                    case QueryUpdateType.UPDATE: {
                        break
                    }
                    default:
                        throw new Error('Invalid update type');
                }
                setAlertMessage('Update servers successful');
                return newQueries;
            });
        } else {
            setAlertMessage('Error: ' + (result.errors.length > 0 ? result.errors.join(';') : 'Fail to modify queries'));
        }
    };

    const onPerformDelete = (query: QueryGeneral) => {
        onUpdateQueries({
            data: query,
            type: QueryUpdateType.DELETE
        }).then(() => history.replace(routerEndpoints.queries.url));
    };
    const onPerformAdd = (query: QueryGeneral) => onUpdateQueries({data: query, type: QueryUpdateType.ADD});
    const onPerformSubmit = (query: QueryGeneral) => {
        onUpdateQueries({
            data: query,
            type: QueryUpdateType.UPDATE
        }).then(() => history.replace(routerEndpoints.queries.url));
    };
    const onCloseSnackBar = () => setAlertMessage('');

    let child: ReactNode;
    switch (props.routeType) {
        case QueryRouteType.LIST: {
            child = <QueryList queries={queries}/>;
            break;
        }
        case QueryRouteType.NEW: {
            child = <QueryCreate addQuery={onPerformAdd}/>;
            break;
        }
        case QueryRouteType.HISTORY: {
            if (queries.length === 0) {
                child = null;
            } else {
                const index = queries.findIndex(q => q.name === selectedQueryName);
                if (index < 0) {
                    child = <Redirect to={routerEndpoints.queries.url}/>
                }
                const query = queries[index];
                if (query == null) {
                    child = <Redirect to={routerEndpoints.queries.url}/>
                } else {
                    child = <QueryHistory query={query} deleteQuery={onPerformDelete} submitQuery={onPerformSubmit}/>;
                }
            }
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
}