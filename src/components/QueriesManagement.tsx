import React, {useEffect} from "react";
import {PageCommonProps} from "./CommonProps";

interface QueriesProps extends PageCommonProps {}
export function QueriesManagement(props: QueriesProps) {
    const {updateTitle} = props;
    useEffect(() => {
        updateTitle();
    }, [updateTitle]);
    return (<div/>);
}