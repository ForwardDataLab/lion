import React, {useEffect} from "react";
import {ViewCommonProps} from "../../types/ViewProps";

interface MetaQueriesProps extends ViewCommonProps {
}

// todo: remove this component
export function MetaQueriesManagement(props: MetaQueriesProps) {
    const {updateTitle} = props;
    useEffect(() => {
        updateTitle();
    }, [updateTitle]);
    return (<div/>);
}