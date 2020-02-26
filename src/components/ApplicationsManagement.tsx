import React, {useEffect} from "react";
import {PageCommonProps} from "./CommonProps";

interface ApplicationsProps extends PageCommonProps{}

export function ApplicationsManagement(props: ApplicationsProps) {
    const {updateTitle} = props;
    useEffect(() => {
        updateTitle();
    }, [updateTitle]);
    return (<div/>);
}