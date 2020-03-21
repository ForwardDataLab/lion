import React, {useCallback, useEffect, useState} from "react";
import {QueryGeneral} from "../../../../models/Query";
import fakeSchema from "../../../../data/fakeSchema2.json";
import {IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip} from "@material-ui/core";
import {queryHistoryStyles} from "../../../../styles/queryStyle";
import {cleanUpDetailViz, createDetailViz} from "./QueryCreateDetailViz";
import {cleanUpResponseViz} from "./QueryCreateResponseViz";
import {JSONObject} from "../../../../types/Json";
import {SchemaTree} from "../queryCreateComponents/SchemaTree";
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import ArrowUpwardOutlinedIcon from '@material-ui/icons/ArrowUpwardOutlined';


const fakeTree = JSON.parse(`{"GitHubQuery":[{"parentBaseObjectName":null,"parentName":null,"baseObjectName":"GitHubQuery","name":"GitHubQuery","arguments":null},{"parentBaseObjectName":"GitHubQuery","parentName":"GitHubQuery","baseObjectName":"GitHubQuery","name":"searchRepository","arguments":{"query":"new query"}}],"Repository":[{"parentBaseObjectName":"GitHubQuery","parentName":"searchRepository","baseObjectName":"Repository","name":"Repository","arguments":null},{"parentBaseObjectName":"Repository","parentName":"Repository","baseObjectName":"Repository","name":"issue_comment_url","arguments":null},{"parentBaseObjectName":"Repository","parentName":"Repository","baseObjectName":"Repository","name":"merges_url","arguments":null},{"parentBaseObjectName":"Repository","parentName":"Repository","baseObjectName":"Repository","name":"issues_url","arguments":null}]}`);

interface QueryDetailPanelProps {
    query: QueryGeneral,

    requestDelete(): void,

    requestSubmit(): void,
}

export function QueryDetailPanel(props: QueryDetailPanelProps) {
    const {query, requestDelete, requestSubmit} = props;
    const [schema, setSchema] = useState<JSONObject | null>(null);
    const [selectedTree, setSelectedTree] = useState<SchemaTree | null>(null);
    const styles = queryHistoryStyles();
    useEffect(() => () => {
        cleanUpDetailViz()
    }, []);
    useEffect(() => {
        // todo: fetch schema here
        (async () => {
            setSchema(fakeSchema);
        })();
        // todo: fetch tree here
        (async () => {
            setSelectedTree(fakeTree);
        })();
    }, [query, setSchema, setSelectedTree]);
    const onRefUpdate = useCallback((ref: HTMLElement | null) => {
        if (ref == null) {
            cleanUpResponseViz();
            return;
        }
        if (schema == null || selectedTree == null) {
            return;
        }
        createDetailViz({
            rawSchema: schema,
            selectedTree,
            containerElem: ref
        });
    }, [schema, selectedTree]);
    return (
        <div className={styles.detailPanelWrapper}>
            <small className={styles.detailHelperText}>All fields and graphs are not editable; please create a new query
                if need to make changes</small>
            <TableContainer className={styles.detailTable}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align={'center'}>Name</TableCell>
                            <TableCell align={'center'}>Source</TableCell>
                            <TableCell align={'center'}>Schedule</TableCell>
                            <TableCell align={'center'}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell align={'center'}>{query.name}</TableCell>
                            <TableCell align={'center'}>{query.source}</TableCell>
                            <TableCell align={'center'}>{query.schedule}</TableCell>
                            <TableCell align={'center'}>
                                <Tooltip title={"delete query"}>
                                    <IconButton color={'secondary'} aria-label="delete query" component={"span"}
                                                onClick={requestDelete}>
                                        <CloseOutlinedIcon/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={"re-submit query"}>
                                    <IconButton color={'secondary'} aria-label="re-submit query" component={"span"}
                                                onClick={requestSubmit}>
                                        <ArrowUpwardOutlinedIcon/>
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <div className={styles.detailVizOutline} ref={onRefUpdate}/>
        </div>
    )
}