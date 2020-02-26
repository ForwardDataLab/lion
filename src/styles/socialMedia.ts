import {makeStyles} from "@material-ui/core/styles";

export const socialMediaStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    wrapperStyle: {
       padding: theme.spacing(3)
    },
    listItemStyle: {
        height: '80px'
    },
    authorizedTextStyle: {
        textAlign: 'right'
    },
    titleStyle: {
        margin: theme.spacing(0, 0, 2, 0),
        color: '#212121'
    },
    helperTextStyle: {
        display: 'block',
        margin: theme.spacing(0, 0, 2, 0),
        color: '#757575'
    },
    imageStyle: {
        marginRight: theme.spacing(3)
    }
}));
