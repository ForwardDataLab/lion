import React, {useEffect} from "react";
import {ViewCommonProps} from "../../types/ViewProps";

interface ApplicationsProps extends ViewCommonProps {
}

export function ApplicationsManagement(props: ApplicationsProps) {
    const {updateTitle} = props;
    useEffect(() => {
        updateTitle();
    }, [updateTitle]);
    return (<div/>);
}