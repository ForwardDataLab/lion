import React, {useContext, useEffect, useState} from "react";
import {ViewCommonProps} from "../../types/props/ViewProps";
import {routerEndpoints} from "../endpoints/routerEndpoints";
import {UserExtended} from "../../models/User";
import {Redirect, useParams} from "react-router-dom";
import {UserEdit} from "./users/UserEdit";
import {UserList} from "./users/UserList";
import {RouteParams} from "../../types/props/ServerProps";
import {globalStore, SET_USER} from "../../store/globalState";

const fakeUsers: UserExtended[] = [
    {name: `Start from App`, isAdmin: true, email: `user1@email.com`, quota: 1, usedQuota: 0.5}
];

enum UserRedirectType {
    NONE, LIST, EDIT
}

interface UserProps extends ViewCommonProps {
    isEdit: boolean
}

export function UserManagement(props: UserProps) {
    const {updateTitle} = props;
    const [users, setUsers] = useState<UserExtended[]>([]);
    const [redirectType, setRedirectType] = useState<UserRedirectType>(UserRedirectType.NONE);
    const [selectedUsername, setSelectedUsername] = useState<string | null>(null);
    const passedUserEmail = useParams<RouteParams>()[routerEndpoints.queries.history.paramName];
    const {state, dispatch} = useContext(globalStore);
    useEffect(() => {
        updateTitle(routerEndpoints.users.name);
    }, [updateTitle]);
    useEffect(() => {
        // todo: fetch users here
        (async () => {
            console.log('re-rendered users');
            setUsers(fakeUsers);
        })();
    }, []);
    const onEditUser = (user: UserExtended) => {
        setSelectedUsername(user.name);
        setRedirectType(UserRedirectType.EDIT);
    };
    const onSaveUser = (user: UserExtended) => {
        setUsers(users => {
            const index = users.findIndex(u => u.email === user.email);
            if (index < 0) {
                throw new Error('Save function should not be invoked if user cannot be find')
            }
            const newUsers = [...users];
            newUsers[index] = user;
            setRedirectType(UserRedirectType.LIST);
            return newUsers;
        });
    };
    const onDeleteUser = (email: string) => {
        setUsers(users => {
            const index = users.findIndex(u => u.email === email);
            if (index < 0) {
                throw new Error('Delete function should not be invoked if user cannot be find')
            }
            if (users[index].name === state.user?.name) {
                dispatch({type: SET_USER, payload: null});
                return [];
            }
            const newUsers = [...users];
            newUsers.splice(index, 1);
            setRedirectType(UserRedirectType.LIST);
            return newUsers;
        });
    };

    switch (redirectType) {
        case UserRedirectType.EDIT:
            if (selectedUsername != null && !props.isEdit) {
                // setRedirectType(UserRedirectType.NONE);
                // console.log(routerEndpoints.users.edit.urlBase + selectedUsername)
                return <Redirect to={routerEndpoints.users.edit.urlBase + selectedUsername}/>
            }
            setRedirectType(UserRedirectType.NONE);
            break;
        case UserRedirectType.LIST:
            // setRedirectType(UserRedirectType.NONE);
            if (props.isEdit) {
                return <Redirect to={routerEndpoints.users.url}/>;
            }
            setRedirectType(UserRedirectType.NONE);
            break;
        case UserRedirectType.NONE:
            break
    }
    if (props.isEdit && passedUserEmail != null) {
        const user = users.filter(u => u.name === passedUserEmail)[0];
        if (user != null) {
            return <UserEdit onDelete={onDeleteUser} onSave={onSaveUser} user={user}/>;
        }
    }
    return <UserList users={users} onEdit={onEditUser}/>
}