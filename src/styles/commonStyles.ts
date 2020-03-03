import {Theme} from "@material-ui/core";

export const commonPageStyles = (theme: Theme) => ({
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