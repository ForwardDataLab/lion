import {fade, makeStyles} from "@material-ui/core/styles";
import {Theme} from "@material-ui/core";

const drawerWidth = 240;
export const appStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex'
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    hide: {
        display: 'none',
    },
    drawerHeader: {
        display: 'flex',
        ...theme.mixins.toolbar,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(4),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
        marginTop: '70px' // this is hardcoded to match the height of app bar
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0
    },
    nameCardHeader: {
        margin: '0 0',
        color: '#212121',
        fontSize: '1.5rem'
    },
    nameCard: {
        width: '100%',
        marginTop: '64px', // this is hardcoded to match the height of app bar
        padding: theme.spacing(0, 0, 2, 2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    linkNoStyle: {
        textDecoration: 'none',
        color: '#212121',
        fontSize: '0.75rem'
    },
    linkActiveStyle: {
        '&> div': {
            backgroundColor: fade(theme.palette.primary.light, 0.12) // hack the active button color in drawer
        }
    }
}));