import React, {useEffect} from "react";
import {ViewCommonProps} from "../../types/ViewProps";

interface UserProps extends ViewCommonProps{}

export function UserManagement(props: UserProps) {
    const {updateTitle} = props;
    useEffect(() => {
        updateTitle();
    }, [updateTitle]);
    return (<div/>);
}