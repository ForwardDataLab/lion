import React, {useCallback, useState} from "react";
import {QueryGeneral} from "../../../models/Query";
import {queryHistoryStyles} from "../../../styles/queryStyle";
import {Box, Paper, Tab, Tabs, useTheme} from "@material-ui/core";
import {QueryRecordsPanel} from "./queryHistoryComponents/QueryRecordsPanel";

interface QueryHistoryProps {
    query: QueryGeneral,
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    const styles = queryHistoryStyles();
    return (
        <div
            className={styles.intermediateWrapper}
            hidden={value !== index}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && children}
        </div>
    );
}

export function QueryHistory(props: QueryHistoryProps) {
    const styles = queryHistoryStyles();
    const [activeTab, setActiveTab] = useState(0);
    const onChangeTab = useCallback((_, newValue: number) => {
        setActiveTab(newValue);
    }, []);
    return (
        <div>
            <h1 className={styles.titleStyle}>{props.query.name}</h1>
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
                        <QueryRecordsPanel/>
                    </TabPanel>
                    <TabPanel value={activeTab} index={1}>
                        Item Two
                    </TabPanel>
                </div>
            </Paper>
        </div>
    );
}