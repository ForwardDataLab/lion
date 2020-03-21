import React, {ReactNode, useEffect, useState} from "react";
import {
    ServerProps,
    ServerRouteParams,
    ServerRouteType,
    ServerUpdateRequest,
    ServerUpdateResult,
    ServerUpdateType
} from "../../../types/props/ServerProps";
import {ServerList} from "./ServerList";
import {ServerEdit} from "./ServerEdit";
import {routerEndpoints} from "../../endpoints/routerEndpoints";
import {useParams} from "react-router-dom";
import {Button, Snackbar} from "@material-ui/core";
import {Server} from "../../../models/Server";
import {SnackBarTransition} from "../../utils/commonComponents";

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

export function ServerManagement(props: ServerProps) {
    const {updateTitle} = props;
    const paramName = useParams<ServerRouteParams>()[routerEndpoints.servers.edit.paramName];
    const [servers, setServers] = useState([] as Server[]);
    const [alertMessage, setAlertMessage] = useState('');
    useEffect(() => {
        updateTitle(routerEndpoints.servers.name);
    }, [updateTitle]);
    useEffect(() => {
        // todo: make http requests
        setServers(fakeServers);
    }, [setServers]);
    const onUpdateServers = async (request: ServerUpdateRequest) => {
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
    };
    const onPerformUpdate = (server: Server) => onUpdateServers({data: server, type: ServerUpdateType.UPDATE});
    const onPerformDelete = (server: Server) => onUpdateServers({data: server, type: ServerUpdateType.DELETE});
    const onPerformAdd = (server: Server) => onUpdateServers({data: server, type: ServerUpdateType.ADD});

    const onCloseSnackBar = () => setAlertMessage('');

    let child: ReactNode;
    switch (props.routeType) {
        case ServerRouteType.LIST: {
            child = <ServerList servers={servers}/>;
            break;
        }
        case ServerRouteType.EDIT: {
            const i = servers.findIndex((s: Server) => s.name === paramName);
            if (i < 0) {
                child = <ServerList servers={servers}/>;
            } else {
                child = <ServerEdit onSave={onPerformUpdate} server={servers[i]} onDelete={onPerformDelete}/>;
            }
            break;
        }
        case ServerRouteType.NEW: {
            child = <ServerEdit onSave={onPerformAdd}/>;
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
                action={<Button color="secondary" size="small" onClick={onCloseSnackBar}>Close</Button>}
            />
        </div>
    );
}