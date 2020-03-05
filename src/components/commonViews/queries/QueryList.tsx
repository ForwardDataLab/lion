import React, {useState} from "react";
import {QueryGeneral} from "../../../models/Query";
import MaterialTable, {Action} from "material-table";
import {Redirect} from "react-router-dom";
import {routerEndpoints} from "../../endpoints/routerEndpoints";
import {Button} from "@material-ui/core";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import HistoryOutlinedIcon from '@material-ui/icons/HistoryOutlined';
import {queryStyles} from "../../../styles/queryStyle";
import {materialTableIcons} from "../../utils/commonComponents";

enum QueryListOption {
    NEW, HISTORY, NONE
}

interface QueryListProps {
    queries: QueryGeneral[]
}

const tableColumns = [
    {title: 'Name', field: 'name'},
    {title: 'Source', field: 'source'},
    {title: 'Schedule', field: 'schedule'}
];

export function QueryList(props: QueryListProps) {
    const styles = queryStyles();
    const [option, setOption] = useState(QueryListOption.NONE);
    const [query, setQuery] = useState<QueryGeneral | null>(null);

    const onClickNew = () => setOption(QueryListOption.NEW);


    const tableActions: Action<QueryGeneral>[] = [
        {
            icon: () => <HistoryOutlinedIcon color='secondary'/>,
            tooltip: 'View History',
            onClick: (e, query) => {
                if (Array.isArray(query)) {
                    throw new Error('onClick in material table should not involve multiple query instances');
                }
                setOption(QueryListOption.HISTORY);
                setQuery(query);
            }
        }
    ];
    const renderedRedirectNew = (<Redirect to={routerEndpoints.queries.create.url}/>);
    const renderedRedirectHistory = (<Redirect to={routerEndpoints.queries.history.urlBase + query?.name}/>);
    const renderedList = (
        <div>
            <h1 className={styles.titleStyle}>All Queries</h1>
            <div className={styles.buttonWrapper}>
                <Button
                    className={styles.buttonRightEnd}
                    color="secondary"
                    startIcon={<AddCircleOutlineOutlinedIcon/>}
                    onClick={onClickNew}
                >
                    Add New Query
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
                data={props.queries}
                components={{
                    Container: (props) => <div {...props}/>
                }}
                icons={materialTableIcons}
            />
        </div>
    );

    switch (option) {
        case QueryListOption.NEW:
            return renderedRedirectNew;
        case QueryListOption.HISTORY:
            return renderedRedirectHistory;
        case QueryListOption.NONE:
            return renderedList;
        default:
            throw new Error('Invalid ServerListOption value');
    }
}