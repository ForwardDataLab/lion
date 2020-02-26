import React, {useEffect} from "react";
import {PageCommonProps} from "./CommonProps";

interface MetaQueriesProps extends PageCommonProps {}

export function MetaQueriesManagement(props: MetaQueriesProps) {
    const {updateTitle} = props;
    useEffect(() => {
        updateTitle();
    }, [updateTitle]);
    return (<div/>);
}