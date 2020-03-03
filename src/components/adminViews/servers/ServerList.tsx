import React, {forwardRef, useCallback} from 'react';

import {Server} from "../../../types/Server";
import {serverStyles} from "../../../styles/servers";
import MaterialTable, {Action} from "material-table";
import {Button, Grid} from '@material-ui/core';
import {Redirect} from 'react-router-dom';
import {routerEndpoints} from "../../../data/routerEndpoints";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import KeyboardArrowRightOutlinedIcon from '@material-ui/icons/KeyboardArrowRightOutlined';
import FirstPageOutlinedIcon from '@material-ui/icons/FirstPageOutlined';
import LastPageOutlinedIcon from '@material-ui/icons/LastPageOutlined';
import ArrowRightOutlinedIcon from '@material-ui/icons/ArrowRightOutlined';
import KeyboardArrowLeftOutlinedIcon from '@material-ui/icons/KeyboardArrowLeftOutlined';
import ArrowUpwardOutlinedIcon from '@material-ui/icons/ArrowUpwardOutlined';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import RefreshOutlinedIcon from '@material-ui/icons/RefreshOutlined';
import clsx from "clsx";


interface ServerListDetailPanelProps {
    server: Server
}

interface ServerListProps {
    servers: Server[]
}

const tableColumns = [
    {title: 'Name', field: 'name'},
    {title: 'URL', field: 'url'}
];

const tableActions: Action<Server>[] = [
    {
        icon: () => <EditOutlinedIcon color='secondary'/>,
        tooltip: 'Edit Server',
        onClick: (e, server) => {
            if (Array.isArray(server)) {
                throw new Error('onClick in material table should not involve multiple server instances');
            }
            return (
                <Redirect to={routerEndpoints.servers.detail.urlBase + server.name}/>
            )
        }
    }, {
        icon: () => <RefreshOutlinedIcon color='secondary'/>,
        tooltip: 'Refresh Schema',
        onClick: (e, server) => {
            if (Array.isArray(server)) {
                throw new Error('onClick in material table should not involve multiple server instances');
            }
            console.log(`clicked ${server.name}`);
        }
    }
];

function convertBoolToString(b: boolean) {
    return b ? 'Yes' : 'No';
}

function ServerListDetailPanel(props: ServerListDetailPanelProps) {
    const styles = serverStyles();
    return (
        <div>
            <Grid className={clsx(styles.grid, styles.indentedGrid)} container spacing={2}>
                <Grid item xs={4}>
                    <div className={styles.detailPanelItemTitle}>Require Authorization</div>
                </Grid>
                <Grid item xs={8}>
                    <div
                        className={styles.detailPanelItemContent}>
                        {convertBoolToString(props.server.requireAuthorization)}
                    </div>
                </Grid>
                <Grid item xs={4}>
                    <div className={styles.detailPanelItemTitle}>Require Authentication</div>
                </Grid>
                <Grid item xs={8}>
                    <div
                        className={styles.detailPanelItemContent}>{convertBoolToString(props.server.requireAuthentication)}</div>
                </Grid>
                <Grid item xs={12}>
                    <div className={styles.detailPanelItemTitle}>Description</div>
                </Grid>
                <Grid item xs={12}>
                    <div className={clsx(styles.detailPanelItemContent, styles.indentedGridItem)}>{props.server.description}</div>
                </Grid>
            </Grid>
        </div>
    )
}

export function ServerList(props: ServerListProps) {
    const styles = serverStyles();
    const onClickNew = useCallback(() => (<Redirect to={routerEndpoints.servers.create.url}/>), []);
    return (
        <div>
            <h1 className={styles.titleStyle}>All Servers</h1>
            <small className={styles.helperTextStyle}>Click on "Refresh" to refresh the schema regularly</small>
            <div className={styles.buttonWrapper}>
                <Button
                    className={styles.buttonRightEnd}
                    color="secondary"
                    startIcon={<AddCircleOutlineOutlinedIcon/>}>
                    Add New Server
                </Button>
            </div>
            <MaterialTable
                options={{
                    toolbar: false,
                    showTitle: false,
                    search: false,
                    actionsColumnIndex: -1,
                    paginationType: 'stepped'
                }}
                columns={tableColumns}
                actions={tableActions}
                data={props.servers}
                components={{
                    Container: (props) => <div {...props}/>
                }}
                icons={{
                    FirstPage: forwardRef((props, ref) => <FirstPageOutlinedIcon {...props} ref={ref} />),
                    LastPage: forwardRef((props, ref) => <LastPageOutlinedIcon {...props} ref={ref} />),
                    NextPage: forwardRef((props, ref) => <KeyboardArrowRightOutlinedIcon {...props} ref={ref} />),
                    PreviousPage: forwardRef((props, ref) => <KeyboardArrowLeftOutlinedIcon {...props} ref={ref} />),
                    SortArrow: forwardRef((props, ref) => <ArrowUpwardOutlinedIcon {...props} ref={ref} />),
                }}
                detailPanel={[
                    {
                        icon: () => (<ArrowRightOutlinedIcon/>),
                        tooltip: 'Details',
                        render: (server: Server) => (
                            <ServerListDetailPanel server={server}/>
                        )
                    }
                ]}
            />
        </div>
    );
}