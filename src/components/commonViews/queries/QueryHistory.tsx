import React, {useCallback, useState} from "react";
import {QueryGeneral} from "../../../models/Query";
import {queryHistoryStyles} from "../../../styles/queryStyle";
import {Paper, Tab, Tabs} from "@material-ui/core";
import {QueryRecordsPanel} from "./queryHistoryComponents/QueryRecordsPanel";
import {QueryDetailPanel} from "./queryHistoryComponents/QueryDetailPanel";
import clsx from "clsx";

interface QueryHistoryProps {
    query: QueryGeneral,

    deleteQuery(query: QueryGeneral): void,

    submitQuery(query: QueryGeneral): void,
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;
    const styles = queryHistoryStyles();
    return (
        <div
            className={clsx(styles.intermediateWrapper, value === index ? styles.showElement : styles.removeElement)}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && children}
        </div>
    );
}

export function QueryHistory(props: QueryHistoryProps) {
    const {query, deleteQuery, submitQuery} = props;
    const styles = queryHistoryStyles();
    const [activeTab, setActiveTab] = useState(0);
    const onChangeTab = useCallback((_, newValue: number) => {
        setActiveTab(newValue);
    }, []);
    const onDeleteQuery = useCallback(() => {
        deleteQuery(query);
    }, [query, deleteQuery]);
    const onSubmitQuery = useCallback(() => {
        submitQuery(query);
    }, [query, submitQuery]);
    return (
        <div>
            <h1 className={styles.titleStyle}>{query.name}</h1>
            <Paper className={styles.historyWrapper}>
                <div className={styles.tabsWrapper}>
                    <Tabs
                        value={activeTab}
                        indicatorColor="secondary"
                        textColor="secondary"
                        onChange={onChangeTab}
                        aria-label="disabled tabs example"
                    >
                        <Tab label="Query History"/>
                        <Tab label="Query Detail"/>
                    </Tabs>
                </div>
                <div className={styles.tabPanelWrapper}>
                    <TabPanel value={activeTab} index={0}>
                        <QueryRecordsPanel query={query}/>
                    </TabPanel>
                    <TabPanel value={activeTab} index={1}>
                        <QueryDetailPanel query={query} requestDelete={onDeleteQuery} requestSubmit={onSubmitQuery}/>
                    </TabPanel>
                </div>
            </Paper>
        </div>
    );
}