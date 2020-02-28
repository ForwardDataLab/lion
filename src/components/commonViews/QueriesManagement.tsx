import React, {useContext, useEffect, useState} from "react";
import {ViewCommonProps} from "../../types/ViewProps";
import {globalStore} from "../../store/globalState";
import {Query} from "../../types/Query";


interface QueriesProps extends ViewCommonProps {}

export function QueriesManagement(props: QueriesProps) {
    const {updateTitle} = props;
    // const {state} = useContext(globalStore);
    // const {queries, setQueries} = useState([] as Query[]);
    useEffect(() => {
        updateTitle();
    }, [updateTitle]);
    // useEffect(() => {
    //     // todo: fetch queries here
    //
    // }, []);
    return (<div/>);
}