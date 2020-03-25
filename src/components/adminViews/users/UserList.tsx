import {UserExtended} from "../../../models/User";
import {materialTableIcons} from "../../utils/commonComponents";
import MaterialTable, {Action} from "material-table";
import React from "react";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import {userStyles} from "../../../styles/userStyle";

const tableColumns = [
    {title: 'User name', field: 'name'},
    {title: 'Quota used', field: 'usedQuota'},
    {title: 'Quota available', field: 'quota'}
];

interface UserListProps {
    users: UserExtended[],

    onEdit(user: UserExtended): void
}


export function UserList(props: UserListProps) {
    const tableActions: Action<UserExtended>[] = [
        {
            icon: () => <EditOutlinedIcon color='secondary'/>,
            tooltip: 'Edit User',
            onClick: (e, user) => {
                if (Array.isArray(user)) {
                    throw new Error('onClick in material table should not involve multiple user instances');
                }
                props.onEdit(user);
            }
        },
    ];
    const styles = userStyles();
    return (
        <div>
            <h1 className={styles.titleStyle}>Manage Users</h1>
            <div className={styles.form}>
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
                    data={props.users}
                    components={{
                        Container: (props) => <div {...props}/>
                    }}
                    icons={materialTableIcons}
                />
            </div>
        </div>
    )
}