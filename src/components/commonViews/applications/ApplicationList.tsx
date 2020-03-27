import {Application} from "../../../models/Application";
import React from "react";
import {Button} from "@material-ui/core";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import MaterialTable, {Action} from "material-table";
import {materialTableIcons} from "../../utils/commonComponents";
import {applicationStyles} from "../../../styles/applicationStyle";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";

interface ApplicationListProps {
    applications: Application[],

    onCreate(): void,

    onEdit(app: Application): void,
}

const tableColumns = [
    {title: 'Name', field: 'name'},
    {title: 'Home', field: 'home'}
];

export function ApplicationList(props: ApplicationListProps) {
    const styles = applicationStyles();
    const tableActions: Action<Application>[] = [
        {
            icon: () => <EditOutlinedIcon color='secondary'/>,
            tooltip: 'Edit Server',
            onClick: (e, app) => {
                if (Array.isArray(app)) {
                    throw new Error('onClick in material table should not involve multiple application instances');
                }
                props.onEdit(app);
            }
        },
    ];
    return (
        <div>
            <h1>All Applications</h1>
            <div className={styles.buttonWrapper}>
                <Button
                    className={styles.buttonRightEnd}
                    color="secondary"
                    startIcon={<AddCircleOutlineOutlinedIcon/>}
                    onClick={props.onCreate}
                >
                    Add New Application
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
                data={props.applications}
                components={{
                    Container: (props) => <div {...props}/>
                }}
                icons={materialTableIcons}
            />
        </div>
    )
}