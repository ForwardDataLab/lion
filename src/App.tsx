import React, {Component} from 'react';
import './App.css';
import {User} from "./models/user";
import {
    AppBar,
    Toolbar,
    Typography,
    Paper,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon, ListItemText
} from '@material-ui/core';
import {Login} from "./components/Login";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import {Share, Menu, Search, LinearScale, Explore} from "@material-ui/icons";
import {SocialMediaManagement} from "./components/SocialMediaManagement";
import {info} from "./components/RouterInformation";
import {QueriesManagement} from "./components/QueriesManagement";
import {MetaQueriesManagement} from "./components/MetaQueriesManagement";
import {ApplicationsManagement} from "./components/ApplicationsManagement";

class App extends Component {
  state = {
    user: null
  };
  onUpdateUser = (user: User) => {
    this.setState({...this.state, user});
  };
  render() {
    const isLoggedIn = this.state.user != null;
    const $emptyMain = (
        <Router>
            <div>
                <AppBar position="static">
                    <Toolbar variant="dense">
                        <Typography variant="h6">
                            Listen Online
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Switch>
                    <Route path={'/'}>
                        <Login updateUserInfo={this.onUpdateUser}/>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
    // todo: add logout
    const $fullMain = (
        <Router>
            <div>
                <AppBar position={'fixed'}>
                    <Toolbar>
                        <IconButton>
                            <Menu/>
                        </IconButton>
                        <Typography variant="h6" noWrap>
                            Persistent drawer
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer variant="persistent" anchor="left" open={isLoggedIn}>
                    <List>
                        <Link to={info.socialMedia.url} key={info.socialMedia.name}>
                            <ListItem button>
                                <ListItemIcon><Share/></ListItemIcon>
                                <ListItemText primary={info.socialMedia.name} />
                            </ListItem>
                        </Link>
                        <Link to={info.queries.url} key={info.queries.name}>
                            <ListItem button>
                                <ListItemIcon><Search/></ListItemIcon>
                                <ListItemText primary={info.queries.name} />
                            </ListItem>
                        </Link>
                        <Link to={info.metaQueries.url} key={info.metaQueries.name}>
                            <ListItem button>
                                <ListItemIcon><LinearScale/></ListItemIcon>
                                <ListItemText primary={info.metaQueries.name} />
                            </ListItem>
                        </Link>
                        <Link to={info.applications.url} key={info.applications.name}>
                            <ListItem button>
                                <ListItemIcon><Explore/></ListItemIcon>
                                <ListItemText primary={info.applications.name} />
                            </ListItem>
                        </Link>
                    </List>
                </Drawer>

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
                    <Route path={'/'}>
                        <QueriesManagement/>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
    return isLoggedIn ? $fullMain : $emptyMain;
  }
}

export default App;
