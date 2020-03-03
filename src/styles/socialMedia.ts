import {makeStyles} from "@material-ui/core/styles";
import {commonPageStyles} from "./commonStyles";

export const socialMediaStyles = makeStyles(theme => ({
    ...commonPageStyles(theme),
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
    imageStyle: {
        marginRight: theme.spacing(3)
    }
}));
