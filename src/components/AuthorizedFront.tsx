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
import {BrowserRouter as Router, Link, NavLink, Redirect, Route, Switch} from "react-router-dom";
import {info} from "../data/routerInformation";
import {QueriesManagement} from "./QueriesManagement";
import {SocialMediaManagement} from "./SocialMediaManagement";
import {MetaQueriesManagement} from "./MetaQueriesManagement";
import {ApplicationsManagement} from "./ApplicationsManagement";
import React, {useCallback, useContext, useState} from "react";
import {appStyles} from "../styles/app";
import {RouteProps} from "react-router";
import {ServerManagement} from "./ServerManagement";
import {UserManagement} from "./UserManagement";
import {globalStore} from "../store/globalState";

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
    const [title, setTitle] = useState(info.queries.name);
    const [isOpen, toggleMenuOpen] = useState(true);
    const {state} = useContext(globalStore);
    const styles = appStyles();
    const theme = useTheme();
    const onActivePageQueries = useCallback(() => setTitle(info.queries.name), []);
    const onActivePageSocialMedia = useCallback(() => setTitle(info.socialMedia.name), []);
    const onActivePageMetaQueries = useCallback(() => setTitle(info.metaQueries.name), []);
    const onActivePageApplications = useCallback(() => setTitle(info.applications.name), []);
    const onActivePageServers = useCallback(() => setTitle(info.servers.name), []);
    const onActivePageUsers = useCallback(() => setTitle(info.users.name), []);
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
                            <NavLink to={info.queries.url} key={info.queries.name} className={styles.linkNoStyle} activeClassName={styles.linkActiveStyle}>
                                <ListItem button>
                                    <ListItemIcon><Search/></ListItemIcon>
                                    <ListItemText primary={info.queries.name}/>
                                </ListItem>
                            </NavLink>
                            <NavLink to={info.socialMedia.url} key={info.socialMedia.name} className={styles.linkNoStyle} activeClassName={styles.linkActiveStyle}>
                                <ListItem button>
                                    <ListItemIcon><Share/></ListItemIcon>
                                    <ListItemText primary={info.socialMedia.name}/>
                                </ListItem>
                            </NavLink>
                            <NavLink to={info.metaQueries.url} key={info.metaQueries.name} className={styles.linkNoStyle} activeClassName={styles.linkActiveStyle}>
                                <ListItem button>
                                    <ListItemIcon><LinearScale/></ListItemIcon>
                                    <ListItemText primary={info.metaQueries.name}/>
                                </ListItem>
                            </NavLink>
                            <NavLink to={info.applications.url} key={info.applications.name} className={styles.linkNoStyle} activeClassName={styles.linkActiveStyle}>
                                <ListItem button>
                                    <ListItemIcon><Explore/></ListItemIcon>
                                    <ListItemText primary={info.applications.name}/>
                                </ListItem>
                            </NavLink>
                        </List>
                        <Divider/>
                        {user.isAdmin && (
                            <List>
                                <NavLink to={info.servers.url} key={info.servers.name} className={styles.linkNoStyle} activeClassName={styles.linkActiveStyle}>
                                    <ListItem button>
                                        <ListItemIcon><Web/></ListItemIcon>
                                        <ListItemText primary={info.servers.name}/>
                                    </ListItem>
                                </NavLink>
                                <NavLink to={info.users.url} key={info.users.name} className={styles.linkNoStyle} activeClassName={styles.linkActiveStyle}>
                                    <ListItem button>
                                        <ListItemIcon><People/></ListItemIcon>
                                        <ListItemText primary={info.users.name}/>
                                    </ListItem>
                                </NavLink>
                            </List>
                        )}
                        <Divider />
                        <List>
                            <NavLink to={info.help.url} key={info.help.name} className={styles.linkNoStyle} activeClassName={styles.linkActiveStyle}>
                                <ListItem button>
                                    <ListItemIcon><Help/></ListItemIcon>
                                    <ListItemText primary={info.help.name}/>
                                </ListItem>
                            </NavLink>
                        </List>
                    </Drawer>
                </nav>

                <div className={clsx(styles.content, {[styles.contentShift]: isOpen})}>
                    <Switch>
                        <Route path={info.queries.url}>
                            <QueriesManagement updateTitle={onActivePageQueries}/>
                        </Route>
                        <Route path={info.socialMedia.url}>
                            <SocialMediaManagement updateTitle={onActivePageSocialMedia}/>
                        </Route>
                        <Route path={info.metaQueries.url}>
                            <MetaQueriesManagement updateTitle={onActivePageMetaQueries}/>
                        </Route>
                        <Route path={info.applications.url}>
                            <ApplicationsManagement updateTitle={onActivePageApplications}/>
                        </Route>
                        <PrivateRoute isAuthenticated={user.isAdmin} path={info.servers.url}>
                            <ServerManagement updateTitle={onActivePageServers}/>
                        </PrivateRoute>
                        <PrivateRoute isAuthenticated={user.isAdmin} path={info.users.url}>
                            <UserManagement updateTitle={onActivePageUsers}/>
                        </PrivateRoute>
                        <Route path={'/'}>
                            <QueriesManagement updateTitle={onActivePageQueries}/>
                        </Route>
                    </Switch>
                </div>
            </div>
        </Router>
    );
}