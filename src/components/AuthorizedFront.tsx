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
import {Explore, Help, LinearScale, Menu, People, Search, Share, Web} from "@material-ui/icons";
import {BrowserRouter as Router, NavLink, Redirect, Route, Switch} from "react-router-dom";
import {routerEndpoints} from "../data/routerEndpoints";
import {QueriesManagement} from "./commonViews/QueriesManagement";
import {SocialMediaManagement} from "./commonViews/SocialMediaManagement";
import {MetaQueriesManagement} from "./commonViews/MetaQueriesManagement";
import {ApplicationsManagement} from "./commonViews/ApplicationsManagement";
import React, {useCallback, useContext, useState} from "react";
import {appStyles} from "../styles/app";
import {RouteProps} from "react-router";
import {ServerManagement, ServerRouteType} from "./adminViews/ServerManagement";
import {UserManagement} from "./adminViews/UserManagement";
import {globalStore} from "../store/globalState";
import {NotFoundPage} from "./commonViews/NotFoundPage";

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

export function AuthorizedFront() {
    const [title, setTitle] = useState(routerEndpoints.queries.name);
    const [isOpen, toggleMenuOpen] = useState(true);
    const {state} = useContext(globalStore);
    const styles = appStyles();
    const theme = useTheme();
    const onActivePageQueries = useCallback(() => setTitle(routerEndpoints.queries.name), []);
    const onActivePageSocialMedia = useCallback(() => setTitle(routerEndpoints.socialMedia.name), []);
    const onActivePageMetaQueries = useCallback(() => setTitle(routerEndpoints.metaQueries.name), []);
    const onActivePageApplications = useCallback(() => setTitle(routerEndpoints.applications.name), []);
    const onActivePageServers = useCallback(() => setTitle(routerEndpoints.servers.name), []);
    const onActivePageUsers = useCallback(() => setTitle(routerEndpoints.users.name), []);
    const user = state.user;
    if (user == null) {
        throw new Error('user cannot be null');
    }
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
                                <h2 className={styles.nameCardHeader}>Hello,</h2>
                                <h2 className={styles.nameCardHeader} style={{color: theme.palette.secondary.main}}>{user.userName}</h2>
                            </div>
                        </ButtonBase>
                        <Divider />
                        <List>
                            <NavLink to={routerEndpoints.queries.url} key={routerEndpoints.queries.name} className={styles.linkNoStyle} activeClassName={styles.linkActiveStyle}>
                                <ListItem button>
                                    <ListItemIcon><Search/></ListItemIcon>
                                    <ListItemText primary={routerEndpoints.queries.name}/>
                                </ListItem>
                            </NavLink>
                            <NavLink to={routerEndpoints.socialMedia.url} key={routerEndpoints.socialMedia.name} className={styles.linkNoStyle} activeClassName={styles.linkActiveStyle}>
                                <ListItem button>
                                    <ListItemIcon><Share/></ListItemIcon>
                                    <ListItemText primary={routerEndpoints.socialMedia.name}/>
                                </ListItem>
                            </NavLink>
                            <NavLink to={routerEndpoints.metaQueries.url} key={routerEndpoints.metaQueries.name} className={styles.linkNoStyle} activeClassName={styles.linkActiveStyle}>
                                <ListItem button>
                                    <ListItemIcon><LinearScale/></ListItemIcon>
                                    <ListItemText primary={routerEndpoints.metaQueries.name}/>
                                </ListItem>
                            </NavLink>
                            <NavLink to={routerEndpoints.applications.url} key={routerEndpoints.applications.name} className={styles.linkNoStyle} activeClassName={styles.linkActiveStyle}>
                                <ListItem button>
                                    <ListItemIcon><Explore/></ListItemIcon>
                                    <ListItemText primary={routerEndpoints.applications.name}/>
                                </ListItem>
                            </NavLink>
                        </List>
                        <Divider/>
                        {user.isAdmin && (
                            <List>
                                <NavLink to={routerEndpoints.servers.url} key={routerEndpoints.servers.name} className={styles.linkNoStyle} activeClassName={styles.linkActiveStyle}>
                                    <ListItem button>
                                        <ListItemIcon><Web/></ListItemIcon>
                                        <ListItemText primary={routerEndpoints.servers.name}/>
                                    </ListItem>
                                </NavLink>
                                <NavLink to={routerEndpoints.users.url} key={routerEndpoints.users.name} className={styles.linkNoStyle} activeClassName={styles.linkActiveStyle}>
                                    <ListItem button>
                                        <ListItemIcon><People/></ListItemIcon>
                                        <ListItemText primary={routerEndpoints.users.name}/>
                                    </ListItem>
                                </NavLink>
                            </List>
                        )}
                        <Divider />
                        <List>
                            <NavLink to={routerEndpoints.help.url} key={routerEndpoints.help.name} className={styles.linkNoStyle} activeClassName={styles.linkActiveStyle}>
                                <ListItem button>
                                    <ListItemIcon><Help/></ListItemIcon>
                                    <ListItemText primary={routerEndpoints.help.name}/>
                                </ListItem>
                            </NavLink>
                        </List>
                    </Drawer>
                </nav>

                <div className={clsx(styles.content, {[styles.contentShift]: isOpen})}>
                    <Switch>
                        <Route path={routerEndpoints.queries.url}>
                            <QueriesManagement updateTitle={onActivePageQueries}/>
                        </Route>
                        <Route path={routerEndpoints.socialMedia.url}>
                            <SocialMediaManagement updateTitle={onActivePageSocialMedia}/>
                        </Route>
                        <Route path={routerEndpoints.metaQueries.url}>
                            <MetaQueriesManagement updateTitle={onActivePageMetaQueries}/>
                        </Route>
                        <Route path={routerEndpoints.applications.url}>
                            <ApplicationsManagement updateTitle={onActivePageApplications}/>
                        </Route>
                        <PrivateRoute isAuthenticated={user.isAdmin} path={routerEndpoints.servers.url}>
                            <ServerManagement routeType={ServerRouteType.LIST} updateTitle={onActivePageServers}/>
                        </PrivateRoute>
                        <PrivateRoute isAuthenticated={user.isAdmin} path={routerEndpoints.servers.create.url}>
                            <ServerManagement routeType={ServerRouteType.NEW} updateTitle={onActivePageServers}/>
                        </PrivateRoute>
                        <PrivateRoute isAuthenticated={user.isAdmin} path={routerEndpoints.servers.detail.urlDynamic}>
                            <ServerManagement routeType={ServerRouteType.DETAIL} updateTitle={onActivePageServers}/>
                        </PrivateRoute>
                        <PrivateRoute isAuthenticated={user.isAdmin} path={routerEndpoints.users.url}>
                            <UserManagement updateTitle={onActivePageUsers}/>
                        </PrivateRoute>
                        <Route path={'/'}>
                            <QueriesManagement updateTitle={onActivePageQueries}/>
                        </Route>
                        <Route><NotFoundPage/></Route>
                    </Switch>
                </div>
            </div>
        </Router>
    );
}