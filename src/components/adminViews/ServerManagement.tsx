import React, {ReactNode, useCallback, useEffect, useState} from "react";
import {ViewCommonProps} from "../../types/ViewProps";
import {Server, ServerUpdateRequest, ServerUpdateResult, ServerUpdateType} from "../../types/Server";
import {ServerList} from "./ServerList";
import {ServerEdit} from "./ServerEdit";
import {routerEndpoints} from "../../data/routerEndpoints";
import {Redirect, useParams} from "react-router-dom";
import {Snackbar, Slide, Button} from "@material-ui/core";
import {TransitionProps} from "@material-ui/core/transitions";

export enum ServerRouteType {
    LIST, NEW, DETAIL
}

interface ServerProps extends ViewCommonProps{
    routeType: ServerRouteType
}

interface ServerRouteParams {
    [index: string]: string
}

const fakeServers: Server[] = [
    {
        name: 'reddit',
        url: 'http://localhost:50190',
        slug: 'reddit',
        description: 'reddit sample',
        requireAuthentication: true,
        requireAuthorization: false
    },
    {
        name: 'github',
        url: 'http://localhost:53729',
        slug: 'github',
        description: 'github sample',
        requireAuthentication: false,
        requireAuthorization: true
    }
];

function SnackBarTransition(props: TransitionProps) {
    return <Slide {...props} direction="up" />;
}

const SnackBarButton = (
    <Button color="secondary" size="small">Close</Button>
);

export function ServerManagement(props: ServerProps) {
    const {updateTitle} = props;
    const paramName = useParams<ServerRouteParams>()[routerEndpoints.servers.detail.paramName];
    const [servers, setServers] = useState([] as Server[]);
    const [alertMessage, setAlertMessage] = useState('');
    useEffect(() => {
        updateTitle();
    }, [updateTitle]);
    useEffect(() => {
        // todo: make http requests
        setServers(fakeServers);
    }, [setServers]);
    const onUpdateServers = useCallback(async (request: ServerUpdateRequest) => {
        // todo: make http requests
        const result: ServerUpdateResult = {
            isSuccess: true,
            errorMessage: null
        };
        // todo: can fetch brand new data from server
        if (result.isSuccess) {
            const newServers: Server[] = servers.slice(0);
            switch (request.type) {
                case ServerUpdateType.UPDATE: {
                    const i = newServers.findIndex((s: Server) => s.name === request.data.name);
                    if (i < 0) {
                        throw new Error('Server names should be unique');
                    }
                    newServers[i] = request.data;
                    break;
                }
                case ServerUpdateType.DELETE: {
                    const i = newServers.findIndex((s: Server) => s.name === request.data.name);
                    if (i < 0) {
                        throw new Error('Server names should be unique');
                    }
                    newServers.splice(i, 1);
                    break;
                }
                case ServerUpdateType.ADD: {
                    newServers.unshift(request.data);
                    break
                }
                default:
                    throw new Error('Invalid update type');
            }
            setServers(newServers);
            setAlertMessage('Update servers successful');
        } else {
            setAlertMessage('Error: ' + result.errorMessage ?? 'Fail to modify servers');
        }
    }, [servers, setServers, setAlertMessage]);
    const onPerformUpdate = useCallback(
        (server: Server) => onUpdateServers({data: server, type: ServerUpdateType.UPDATE}),
        [onUpdateServers]
    );
    const onPerformDelete = useCallback(
        (server: Server) => onUpdateServers({data: server, type: ServerUpdateType.DELETE}),
        [onUpdateServers]
    );
    const onPerformAdd = useCallback(
        (server: Server) => onUpdateServers({data: server, type: ServerUpdateType.ADD}),
        [onUpdateServers]
    );
    let child: ReactNode;
    switch (props.routeType) {
        case ServerRouteType.LIST: {
            child = <ServerList servers={servers} onDelete={onPerformDelete}/>;
            break;
        }
        case ServerRouteType.DETAIL: {
            const i = servers.findIndex((s: Server) => s.name === paramName);
            if (i < 0) {
                child = <Redirect to={routerEndpoints.invalid.url}/>
            } else {
                child = <ServerEdit onSave={onPerformUpdate} server={servers[i]}/>;
            }
            break;
        }
        case ServerRouteType.NEW: {
            const server: Server = {
                description: "",
                name: "",
                requireAuthentication: false,
                requireAuthorization: false,
                slug: "",
                url: ""
            };
            child = <ServerEdit onSave={onPerformAdd} server={server}/>;
            break;
        }
        default:
            throw new Error('Invalid Server Management Enum Prop');
    }
    return (
        <div>
            <div>{child}</div>
            <Snackbar
                open={alertMessage !== '' && alertMessage != null}
                TransitionComponent={SnackBarTransition}
                message={alertMessage}
                action={SnackBarButton}
            />
        </div>
    );
}