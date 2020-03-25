import React, {useContext, useEffect} from "react";
import {profileStyles} from "../../styles/profileStyle";
import {ViewCommonProps} from "../../types/props/ViewProps";
import {routerEndpoints} from "../endpoints/routerEndpoints";
import {globalStore, REMOVE_USER} from "../../store/globalState";
import {Button, Container, Grid} from "@material-ui/core";
import clsx from "clsx";
import {Close} from "@material-ui/icons"

interface ProfilePageProps extends ViewCommonProps {
}

export function ProfilePage(props: ProfilePageProps) {
    const {updateTitle} = props;
    useEffect(() => {
        updateTitle(routerEndpoints.profile.name);
    }, [updateTitle]);
    const {state, dispatch} = useContext(globalStore);
    const onLogOut = () => dispatch({payload: null, type: REMOVE_USER});
    const styles = profileStyles();
    return (
        <div>
            <h1 className={styles.titleStyle}>User Profile</h1>
            <Container className={styles.grid} maxWidth={'sm'} disableGutters={true}>
                <Grid className={clsx(styles.gridRowSeparated, styles.gridRow)} container spacing={2}>
                    <Grid className={styles.itemName} item xs={4}>
                        Username
                    </Grid>
                    <Grid className={styles.itemValue} item xs={8}>
                        {state.user?.name}
                    </Grid>
                </Grid>
                <Grid className={styles.gridRow} container spacing={2}>
                    <Grid className={styles.itemName} item xs={4}>
                        Authorization Level
                    </Grid>
                    <Grid className={styles.itemValue} item xs={8}>
                        {state.user?.isAdmin ? "Administrator" : "User"}
                    </Grid>
                </Grid>
            </Container>
            <Button
                className={clsx(styles.errorButton, styles.logOutButton)}
                variant={'contained'}
                onClick={onLogOut}
                startIcon={<Close/>}
            >
                LogOut
            </Button>
        </div>
    )
}