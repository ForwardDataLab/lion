import React, {useEffect, useState} from "react";
import {QueryHistoryRecord} from "../../../../models/Query";
import fakeData from "../../../../data/fakeResponse1.json";
import {queryHistoryStyles} from "../../../../styles/queryStyle";
import {QueryRecordsList} from "./QueryRecordsList";
import {QueryResponseViz} from "./QueryResponseViz";

const fakeErrorData = {
    data: {
        searchRepositories: null
    },
    errors: [
        {
            path: ['searchRepositories'],
            message: 'Request failed with status code 422',
            locations: [{line: 1, column: 8}]
        }
    ]
};

const fakeRecords = [
    {
        executionTimestamp: '2020-01-31 02:23:32',
        runtime: 1009,
        data: fakeData
    },{
        executionTimestamp: '2020-01-31 02:23:25',
        runtime: 1182,
        data: fakeErrorData
    },{
        executionTimestamp: '2020-01-31 02:21:22',
        runtime: 1576,
        data: fakeData
    },{
        executionTimestamp: '2020-01-31 02:16:35',
        runtime: 453,
        data: fakeData
    },{
        executionTimestamp: '2020-01-31 02:13:35',
        runtime: 222,
        data: fakeData
    },{
        executionTimestamp: '2020-01-31 02:23:32',
        runtime: 1009,
        data: fakeData
    },{
        executionTimestamp: '2020-01-31 02:23:32',
        runtime: 1009,
        data: fakeData
    },
];

export function QueryRecordsPanel() {
    const [allRecords, setAllRecords] = useState<QueryHistoryRecord[]>([]);
    const [activeRecordIndex, setActiveRecordIndex] = useState(-1);
    const styles = queryHistoryStyles();
    useEffect(() => {
        // todo: fetch all records here
        (async () => {
            setAllRecords(fakeRecords);
        })();
    }, []);
    const data = activeRecordIndex >= 0 && activeRecordIndex < allRecords.length ?
        allRecords[activeRecordIndex].data : null;
    return (
        <div className={styles.historyPanelWrapper}>
            <QueryRecordsList
                records={allRecords}
                setActiveRecordIndex={setActiveRecordIndex}
                activeRecordIndex={activeRecordIndex}
            />
            <QueryResponseViz data={data}/>
        </div>
    )
}