import React, {useEffect} from "react";
import {ViewCommonProps} from "../../types/props/ViewProps";
import {routerEndpoints} from "../endpoints/routerEndpoints";

interface UserProps extends ViewCommonProps {
}

export function UserManagement(props: UserProps) {
    const {updateTitle} = props;
    useEffect(() => {
        updateTitle(routerEndpoints.users.name);
    }, [updateTitle]);
    // quota, certain amount of API calls
    // delete users
    return (<div/>);
}