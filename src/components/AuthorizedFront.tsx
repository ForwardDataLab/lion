import {
    AppBar,
    ButtonBase,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    useTheme
} from "@material-ui/core";
import clsx from "clsx";
import {Explore, LinearScale, Menu, People, Search, Share, Web} from "@material-ui/icons";
import {BrowserRouter as Router, Link, Redirect, Route, Switch} from "react-router-dom";
import {info} from "../data/RouterInformation";
import {QueriesManagement} from "./QueriesManagement";
import {SocialMediaManagement} from "./SocialMediaManagement";
import {MetaQueriesManagement} from "./MetaQueriesManagement";
import {ApplicationsManagement} from "./ApplicationsManagement";
import React, {useState} from "react";
import {User} from "../models/user";
import {appStyles} from "../styles/app";
import {RouteProps} from "react-router";
import {ServerManagement} from "./ServerManagement";
import {UserManagement} from "./UserManagement";

export interface authorizedFrontProps {
    user: User
}

interface ExtendedRouteProps extends RouteProps {
    isAuthenticated: boolean
}


function PrivateRoute({ isAuthenticated, children, ...rest }: ExtendedRouteProps) {
    return (
        <Route
            {...rest}
            render={({ location }) =>
                isAuthenticated ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
}

export function AuthorizedFront(props: authorizedFrontProps) {
    const [title, setTitle] = useState(info.queries.name);
    const [isOpen, toggleMenuOpen] = useState(false);
    const styles = appStyles();
    const theme = useTheme();
    return (
        <Router>
            <div className={styles.root}>
                <AppBar className={clsx(styles.appBar, {[styles.appBarShift]: isOpen})} position={'fixed'}>
                    <Toolbar>
                        <IconButton
                            className={styles.menuButton}
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={() => toggleMenuOpen(!isOpen)}
                        >
                            <Menu/>
                        </IconButton>
                        <Typography variant="h6" noWrap>
                            {title}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <nav className={styles.drawer}>
                    <Drawer
                        variant="persistent"
                        anchor="left"
                        open={isOpen}
                        classes={{paper: styles.drawerPaper}}
                        ModalProps={{keepMounted: true}}
                    >
                        <ButtonBase>
                            <div className={styles.nameCard}>
                                <h2 className={styles.nameCardHeader}>Hello, <span style={{color: theme.palette.secondary.main}}>{props.user.userName}</span></h2>
                            </div>
                        </ButtonBase>
                        <Divider />
                        <List>
                            <Link to={info.queries.url} key={info.queries.name} className={styles.linkNoStyle}>
                                <ListItem button onClick={() => setTitle(info.queries.name)}>
                                    <ListItemIcon><Search/></ListItemIcon>
                                    <ListItemText primary={info.queries.name}/>
                                </ListItem>
                            </Link>
                            <Link to={info.socialMedia.url} key={info.socialMedia.name} className={styles.linkNoStyle}>
                                <ListItem button onClick={() => setTitle(info.socialMedia.name)}>
                                    <ListItemIcon><Share/></ListItemIcon>
                                    <ListItemText primary={info.socialMedia.name}/>
                                </ListItem>
                            </Link>
                            <Link to={info.metaQueries.url} key={info.metaQueries.name} className={styles.linkNoStyle}>
                                <ListItem button onClick={() => setTitle(info.metaQueries.name)}>
                                    <ListItemIcon><LinearScale/></ListItemIcon>
                                    <ListItemText primary={info.metaQueries.name}/>
                                </ListItem>
                            </Link>
                            <Link to={info.applications.url} key={info.applications.name} className={styles.linkNoStyle}>
                                <ListItem button onClick={() => setTitle(info.applications.name)}>
                                    <ListItemIcon><Explore/></ListItemIcon>
                                    <ListItemText primary={info.applications.name}/>
                                </ListItem>
                            </Link>
                        </List>
                        <Divider/>
                        {props.user.isAdmin && (
                            <List>
                                <Link to={info.servers.url} key={info.servers.name} className={styles.linkNoStyle}>
                                    <ListItem button onClick={() => setTitle(info.servers.name)}>
                                        <ListItemIcon><Web/></ListItemIcon>
                                        <ListItemText primary={info.servers.name}/>
                                    </ListItem>
                                </Link>
                                <Link to={info.users.url} key={info.users.name} className={styles.linkNoStyle}>
                                    <ListItem button onClick={() => setTitle(info.users.name)}>
                                        <ListItemIcon><People/></ListItemIcon>
                                        <ListItemText primary={info.users.name}/>
                                    </ListItem>
                                </Link>
                            </List>
                        )}
                    </Drawer>
                </nav>

                <div className={clsx(styles.content, {[styles.contentShift]: isOpen})}>
                    <Switch>
                        <Route path={info.queries.url}>
                            <QueriesManagement/>
                        </Route>
                        <Route path={info.socialMedia.url}>
                            <SocialMediaManagement/>
                        </Route>
                        <Route path={info.metaQueries.url}>
                            <MetaQueriesManagement/>
                        </Route>
                        <Route path={info.applications.url}>
                            <ApplicationsManagement/>
                        </Route>
                        <PrivateRoute isAuthenticated={props.user.isAdmin} path={info.servers.url}>
                            <ServerManagement/>
                        </PrivateRoute>
                        <PrivateRoute isAuthenticated={props.user.isAdmin} path={info.users.url}>
                            <UserManagement/>
                        </PrivateRoute>
                        <Route path={'/'}>
                            <QueriesManagement/>
                        </Route>
                    </Switch>
                </div>
            </div>
        </Router>
    );
}