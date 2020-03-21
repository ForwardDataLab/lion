import React, {useState} from 'react';

import {serverStyles} from "../../../styles/serverStyle";
import MaterialTable, {Action} from "material-table";
import {Button, Grid} from '@material-ui/core';
import {Redirect} from 'react-router-dom';
import {routerEndpoints} from "../../endpoints/routerEndpoints";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import ArrowRightOutlinedIcon from '@material-ui/icons/ArrowRightOutlined';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import RefreshOutlinedIcon from '@material-ui/icons/RefreshOutlined';
import clsx from "clsx";
import {Server} from "../../../models/Server";
import {ServerListDetailPanelProps, ServerListOption, ServerListProps} from "../../../types/props/ServerProps";
import {materialTableIcons} from "../../utils/commonComponents";


const tableColumns = [
    {title: 'Name', field: 'name'},
    {title: 'URL', field: 'url'}
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
                    <div
                        className={clsx(styles.detailPanelItemContent, styles.indentedGridItem)}>{props.server.description}</div>
                </Grid>
            </Grid>
        </div>
    )
}

export function ServerList(props: ServerListProps) {
    const styles = serverStyles();
    const [option, setOption] = useState(ServerListOption.NONE);
    const [server, setServer] = useState<Server | null>(null);
    const onClickNew = () => {
        setOption(ServerListOption.NEW);
    };

    const tableActions: Action<Server>[] = [
        {
            icon: () => <EditOutlinedIcon color='secondary'/>,
            tooltip: 'Edit Server',
            onClick: (e, server) => {
                if (Array.isArray(server)) {
                    throw new Error('onClick in material table should not involve multiple server instances');
                }
                setOption(ServerListOption.DETAIL);
                setServer(server);
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
    const renderedRedirectNew = (<Redirect to={routerEndpoints.servers.create.url}/>);
    const renderedRedirectUpdate = (<Redirect to={routerEndpoints.servers.edit.urlBase + server?.name}/>);
    const renderedList = (
        <div>
            <h1 className={styles.titleStyle}>All Servers</h1>
            <small className={styles.helperTextStyle}>Click on "Refresh" to refresh the schema regularly</small>
            <div className={styles.buttonWrapper}>
                <Button
                    className={styles.buttonRightEnd}
                    color="secondary"
                    startIcon={<AddCircleOutlineOutlinedIcon/>}
                    onClick={onClickNew}
                >
                    Add New Server
                </Button>
            </div>
            <MaterialTable
                options={{
                    toolbar: false,
                    showTitle: false,
                    search: false,
                    actionsColumnIndex: -1,
                    paginationType: 'stepped',
                    pageSizeOptions: []
                }}
                columns={tableColumns}
                actions={tableActions}
                data={props.servers}
                components={{
                    Container: (props) => <div {...props}/>
                }}
                icons={materialTableIcons}
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

    switch (option) {
        case ServerListOption.NEW:
            return renderedRedirectNew;
        case ServerListOption.DETAIL:
            return renderedRedirectUpdate;
        case ServerListOption.NONE:
            return renderedList;
        default:
            throw new Error('Invalid ServerListOption value');
    }
}