import React, {useCallback, useEffect, useState} from "react";
import {QueryHistoryRecord} from "../../../../models/Query";
import {IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import ChevronRightOutlinedIcon from '@material-ui/icons/ChevronRightOutlined';
import {queryHistoryStyles} from "../../../../styles/queryStyle";

interface QueryRecordsListProps {
    records: QueryHistoryRecord[],
    activeRecordIndex: number,
    setActiveRecordIndex(index: number): void,
}

export function QueryRecordsList(props: QueryRecordsListProps) {
    const {records, setActiveRecordIndex, activeRecordIndex} = props;
    const styles = queryHistoryStyles();
    const tableHeaders = ['Time', 'Runtime (ms)', 'Data'].map(string => {
        return <TableCell key={string}>{string}</TableCell>;
    });
    const tableRows = records.map((record, index) => {
        return (
            <TableRow key={index} className={index === activeRecordIndex ? styles.historyTableHighlightedRow : ''}>
                <TableCell>{record.executionTimestamp}</TableCell>
                <TableCell>{record.runtime}</TableCell>
                <TableCell>
                    <IconButton color={'secondary'} aria-label="show more data" component={"span"} onClick={() => setActiveRecordIndex(index)}>
                        <ChevronRightOutlinedIcon/>
                    </IconButton>
                </TableCell>
            </TableRow>
        )
    });
    return (
        <TableContainer component={'div'} className={styles.historyTableWrapper}>
            <Table className={styles.historyTable} stickyHeader>
                <TableHead>
                    <TableRow>
                        {tableHeaders}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tableRows}
                </TableBody>
            </Table>
        </TableContainer>
    )
}