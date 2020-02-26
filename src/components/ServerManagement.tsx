import React, {useEffect} from "react";
import {PageCommonProps} from "./CommonProps";

interface ServerProps extends PageCommonProps{}

export function ServerManagement(props: ServerProps) {
    const {updateTitle} = props;
    useEffect(() => {
        updateTitle();
    }, [updateTitle]);
    return (<div/>);
}