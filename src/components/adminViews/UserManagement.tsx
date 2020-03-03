import React, {useEffect} from "react";
import {ViewCommonProps} from "../../types/ViewProps";

interface UserProps extends ViewCommonProps {
}

export function UserManagement(props: UserProps) {
    const {updateTitle} = props;
    useEffect(() => {
        updateTitle();
    }, [updateTitle]);
    // quota, certain amount of API calls
    // delete users
    return (<div/>);
}