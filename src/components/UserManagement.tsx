import React, {useEffect} from "react";
import {PageCommonProps} from "./CommonProps";

interface UserProps extends PageCommonProps{}

export function UserManagement(props: UserProps) {
    const {updateTitle} = props;
    useEffect(() => {
        updateTitle();
    }, [updateTitle]);
    return (<div/>);
}