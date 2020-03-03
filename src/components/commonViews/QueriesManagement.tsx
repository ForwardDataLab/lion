import React, {useEffect} from "react";
import {ViewCommonProps} from "../../types/ViewProps";


interface QueriesProps extends ViewCommonProps {
}

// todo: spreadsheet like; nested lists

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