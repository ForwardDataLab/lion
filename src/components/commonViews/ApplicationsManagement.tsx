import React, {useEffect} from "react";
import {ViewCommonProps} from "../../types/props/ViewProps";
import {routerEndpoints} from "../endpoints/routerEndpoints";

interface ApplicationsProps extends ViewCommonProps {
}

export function ApplicationsManagement(props: ApplicationsProps) {
    const {updateTitle} = props;
    useEffect(() => {
        updateTitle(routerEndpoints.applications.name);
    }, [updateTitle]);
    return (<div/>);
}