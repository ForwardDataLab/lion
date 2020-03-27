import React, {useCallback, useEffect, useState} from "react";
import {ViewCommonProps} from "../../types/props/ViewProps";
import {routerEndpoints} from "../endpoints/routerEndpoints";
import {Redirect, Route, Switch, useHistory, useParams} from "react-router-dom";
import {ApplicationList} from "./applications/ApplicationList";
import {ApplicationCreate} from "./applications/ApplicationCreate";
import {Application} from "../../models/Application";
import {RouteParams} from "../../types/props/ServerProps";
import {v4 as uuidv4} from 'uuid';

interface ApplicationsProps extends ViewCommonProps {
}

const fakeApplications: Application[] = [
    {
        name: 'xxx', callbackURL: 'www.google.com', home: 'anything'
    }
];

export function ApplicationsManagement(props: ApplicationsProps) {
    const {updateTitle} = props;
    const [allApplications, setAllApplications] = useState<Application[]>([]);
    const [isRedirectToList, setIsRedirectToList] = useState(false);
    const selectedApplicationName = useParams<RouteParams>()[routerEndpoints.applications.edit.paramName];
    const history = useHistory();
    useEffect(() => {
        updateTitle(routerEndpoints.applications.name);
    }, [updateTitle]);
    useEffect(() => {
        (async () => {
            const newApps = fakeApplications.map(a => {
                if (a.id != null) {
                    return a;
                } else {
                    return {...a, id: uuidv4()};
                }
            });
            setAllApplications(newApps);
        })();
    }, []);
    const onRedirectList = useCallback(() => {
        history.push(routerEndpoints.applications.url);
    }, [history]);
    const onRedirectCreate = () => {
        history.push(routerEndpoints.applications.create.url);
    };
    const onRedirectEdit = (app: Application) => {
        history.push(routerEndpoints.applications.edit.urlBase + app.name);
    };
    const onCreateFinished = (app: Application) => {
        // todo: make http request here
        (async () => {
            setAllApplications(oldApplications => {
                setIsRedirectToList(true);
                return [...oldApplications, app]
            });
        })()
    };
    const onModificationFinished = (app: Application) => {
        // todo: make http request here
        let newApp = app;
        if (app.id == null) {
            newApp = {...app, id: uuidv4()};
        }
        (async () => {
            setAllApplications(oldApplications => {
                const index = oldApplications.findIndex(a => a.id === app.id);
                if (index < 0) {
                    throw new Error('index must be found');
                }
                const newApps = [...oldApplications];
                newApps[index] = newApp;
                setIsRedirectToList(true);
                return newApps;
            });
        })()
    };
    const onDeleteFinished = (app: Application) => {
        (async () => {
            setAllApplications(oldApplications => {
                const index = oldApplications.findIndex(a => a.id === app.id);
                if (index < 0) {
                    throw new Error('index must be found');
                }
                const newApps = [...oldApplications];
                newApps.splice(index, 1);
                setIsRedirectToList(true);
                return newApps;
            });
        })()
    };
    const selectedApplication: Application | null = (() => {
        if (selectedApplicationName == null) {
            return null;
        }
        const index = allApplications.findIndex(a => a.name === selectedApplicationName);
        if (index < 0) {
            return null;
        }
        return allApplications[index];
    })();
    useEffect(() => {
        if (isRedirectToList) {
            onRedirectList();
        }
    }, [isRedirectToList, onRedirectList]);
    return (
        <div>
            <Switch>
                <Route exact path={routerEndpoints.applications.url}>
                    <ApplicationList
                        applications={allApplications}
                        onCreate={onRedirectCreate}
                        onEdit={onRedirectEdit}
                    />
                </Route>
                <Route exact path={routerEndpoints.applications.create.url}>
                    <ApplicationCreate
                        existingApplication={null}
                        onCreate={onCreateFinished}
                        onUpdate={onModificationFinished}
                        onDelete={onDeleteFinished}
                    />
                </Route>
                <Route exact path={routerEndpoints.applications.edit.urlDynamic}>
                    {
                        selectedApplication == null ? (
                            <Redirect to={routerEndpoints.applications.url}/>
                        ) : (
                            <ApplicationCreate
                                existingApplication={selectedApplication}
                                onCreate={onCreateFinished}
                                onUpdate={onModificationFinished}
                                onDelete={onDeleteFinished}
                            />
                        )
                    }
                </Route>
            </Switch>
        </div>
    );
}