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
import {Explore, Help, Menu, People, Search, Share, Translate, Web} from "@material-ui/icons";
import {BrowserRouter as Router, NavLink, Redirect, Route, Switch} from "react-router-dom";
import {routerEndpoints} from "./endpoints/routerEndpoints";
import {QueryManagement, QueryRouteType} from "./commonViews/QueryManagement";
import {SocialMediaManagement} from "./commonViews/SocialMediaManagement";
import {ApplicationsManagement} from "./commonViews/ApplicationsManagement";
import React, {useContext, useState} from "react";
import {appStyles} from "../styles/app";
import {RouteProps} from "react-router";
import {ServerManagement} from "./adminViews/ServerManagement";
import {UserManagement} from "./adminViews/UserManagement";
import {globalStore} from "../store/globalState";
import {NotFoundPage} from "./commonViews/NotFoundPage";
import {ServerRouteType} from "../types/props/ServerProps";
import {ProfilePage} from "./commonViews/ProfilePage";

interface ExtendedRouteProps extends RouteProps {
    isAuthenticated: boolean
}


function PrivateRoute({isAuthenticated, children, ...rest}: ExtendedRouteProps) {
    return (
        <Route
            {...rest}
            render={({location}) =>
                isAuthenticated ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/",
                            state: {from: location}
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
                        <NavLink to={routerEndpoints.profile.url} key={routerEndpoints.profile.name}
                                 className={styles.linkNoStyle} activeClassName={styles.linkActiveStyle}>
                            <ButtonBase className={styles.nameCardWrapper}>
                                <div className={styles.nameCard}>
                                    <h2 className={styles.nameCardHeader}>Hello,</h2>
                                    <h2 className={styles.nameCardHeader}
                                        style={{color: theme.palette.secondary.main}}>{user.name}</h2>
                                </div>
                            </ButtonBase>
                        </NavLink>
                        <Divider/>
                        <List>
                            <NavLink to={routerEndpoints.queries.url} key={routerEndpoints.queries.name}
                                     className={styles.linkNoStyle} activeClassName={styles.linkActiveStyle}>
                                <ListItem button>
                                    <ListItemIcon><Search/></ListItemIcon>
                                    <ListItemText primary={routerEndpoints.queries.name}/>
                                </ListItem>
                            </NavLink>
                            <NavLink to={routerEndpoints.socialMedia.url} key={routerEndpoints.socialMedia.name}
                                     className={styles.linkNoStyle} activeClassName={styles.linkActiveStyle}>
                                <ListItem button>
                                    <ListItemIcon><Share/></ListItemIcon>
                                    <ListItemText primary={routerEndpoints.socialMedia.name}/>
                                </ListItem>
                            </NavLink>
                            <NavLink to={routerEndpoints.applications.url} key={routerEndpoints.applications.name}
                                     className={styles.linkNoStyle} activeClassName={styles.linkActiveStyle}>
                                <ListItem button>
                                    <ListItemIcon><Explore/></ListItemIcon>
                                    <ListItemText primary={routerEndpoints.applications.name}/>
                                </ListItem>
                            </NavLink>
                        </List>
                        <Divider/>
                        {user.isAdmin && (
                            <List>
                                <NavLink to={routerEndpoints.servers.url} key={routerEndpoints.servers.name}
                                         className={styles.linkNoStyle} activeClassName={styles.linkActiveStyle}>
                                    <ListItem button>
                                        <ListItemIcon><Web/></ListItemIcon>
                                        <ListItemText primary={routerEndpoints.servers.name}/>
                                    </ListItem>
                                </NavLink>
                                <NavLink to={routerEndpoints.users.url} key={routerEndpoints.users.name}
                                         className={styles.linkNoStyle} activeClassName={styles.linkActiveStyle}>
                                    <ListItem button>
                                        <ListItemIcon><People/></ListItemIcon>
                                        <ListItemText primary={routerEndpoints.users.name}/>
                                    </ListItem>
                                </NavLink>
                                <NavLink to={routerEndpoints.translator.url} key={routerEndpoints.translator.name}
                                         className={styles.linkNoStyle} activeClassName={styles.linkActiveStyle}>
                                    <ListItem button>
                                        <ListItemIcon><Translate/></ListItemIcon>
                                        <ListItemText primary={routerEndpoints.translator.name}/>
                                    </ListItem>
                                </NavLink>
                            </List>
                        )}
                        <Divider/>
                        <List>
                            <NavLink to={routerEndpoints.help.url} key={routerEndpoints.help.name}
                                     className={styles.linkNoStyle} activeClassName={styles.linkActiveStyle}>
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
                        <Route exact path={'/'}>
                            <QueryManagement
                                key={routerEndpoints.queries.url}
                                routeType={QueryRouteType.LIST}
                                updateTitle={setTitle}
                            />
                        </Route>
                        <Route exact path={routerEndpoints.queries.url}>
                            <QueryManagement
                                key={routerEndpoints.queries.url}
                                routeType={QueryRouteType.LIST}
                                updateTitle={setTitle}
                            />
                        </Route>
                        <Route exact path={routerEndpoints.queries.create.url}>
                            <QueryManagement
                                key={routerEndpoints.queries.create.url}
                                routeType={QueryRouteType.NEW}
                                updateTitle={setTitle}
                            />
                        </Route>
                        <Route path={routerEndpoints.queries.history.urlDynamic}>
                            <QueryManagement
                                key={routerEndpoints.queries.history.urlDynamic}
                                routeType={QueryRouteType.HISTORY}
                                updateTitle={setTitle}
                            />
                        </Route>
                        <Route exact path={routerEndpoints.socialMedia.url}>
                            <SocialMediaManagement updateTitle={setTitle}/>
                        </Route>
                        <Route exact path={routerEndpoints.applications.url}>
                            <ApplicationsManagement updateTitle={setTitle}/>
                        </Route>
                        <Route path={routerEndpoints.profile.url}>
                            <ProfilePage updateTitle={setTitle}/>
                        </Route>
                        <PrivateRoute exact isAuthenticated={user.isAdmin} path={routerEndpoints.servers.url}>
                            <ServerManagement
                                // key={routerEndpoints.servers.url}
                                routeType={ServerRouteType.LIST}
                                updateTitle={setTitle}
                            />
                        </PrivateRoute>
                        <PrivateRoute exact isAuthenticated={user.isAdmin} path={routerEndpoints.servers.create.url}>
                            <ServerManagement
                                // key={routerEndpoints.servers.create.url}
                                routeType={ServerRouteType.NEW}
                                updateTitle={setTitle}
                            />
                        </PrivateRoute>
                        <PrivateRoute isAuthenticated={user.isAdmin} path={routerEndpoints.servers.edit.urlDynamic}>
                            <ServerManagement
                                // key={routerEndpoints.servers.edit.urlDynamic}
                                routeType={ServerRouteType.EDIT}
                                updateTitle={setTitle}
                            />
                        </PrivateRoute>
                        <PrivateRoute exact isAuthenticated={user.isAdmin} path={routerEndpoints.users.edit.urlDynamic}>
                            <UserManagement
                                // key={routerEndpoints.users.edit.urlDynamic}
                                updateTitle={setTitle}
                                isEdit={true}
                            />
                        </PrivateRoute>
                        <PrivateRoute exact isAuthenticated={user.isAdmin} path={routerEndpoints.users.url}>
                            <UserManagement
                                // key={routerEndpoints.users.url}
                                updateTitle={setTitle}
                                isEdit={false}
                            />
                        </PrivateRoute>
                        <PrivateRoute exact isAuthenticated={user.isAdmin} path={routerEndpoints.translator.url}>
                            <NotFoundPage/>
                        </PrivateRoute>
                        <Route><NotFoundPage/></Route>
                    </Switch>
                </div>
            </div>
        </Router>
    );
}