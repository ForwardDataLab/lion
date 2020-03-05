import {createStyles, Theme} from "@material-ui/core";
import {blueGrey} from "@material-ui/core/colors";

export const commonPageStyles = (theme: Theme) => createStyles({
    titleStyle: {
        margin: theme.spacing(0, 0, 2, 0),
        color: '#212121'
    },
    helperTextStyle: {
        display: 'block',
        margin: theme.spacing(0, 0, 2, 0),
        color: '#757575'
    },
});

export const errorButtonStyles = (theme: Theme) => createStyles({
    errorButton: {
        color: theme.palette.getContrastText(blueGrey[700]),
        backgroundColor: blueGrey[700],
        '&:hover': {
            backgroundColor: blueGrey[900],
        },
    },
});

export const commonButtonStyles = (theme: Theme) => createStyles({
    buttonWrapper: {
        display: 'flex',
        flexDirection: 'row'
    },
    buttonRightGap: {
        marginRight: theme.spacing(2)
    },
    buttonRightEnd: {
        marginLeft: 'auto'
    },
});

export const formStyles = (theme: Theme) => createStyles({
    form: {
        margin: theme.spacing(4, 0)
    },
});