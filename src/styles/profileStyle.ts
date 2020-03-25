import {makeStyles, Theme} from "@material-ui/core/styles";
import {commonButtonStyles, commonPageStyles, errorButtonStyles} from "./commonStyles";
import {grey} from "@material-ui/core/colors";

export const profileStyles = makeStyles((theme: Theme) => ({
    ...commonPageStyles(theme),
    ...errorButtonStyles(theme),
    ...commonButtonStyles(theme),
    grid: {
        margin: theme.spacing(5, 0),
    },
    gridRowSeparated: {
        borderBottom: `1px solid ${grey["200"]}`
    },
    gridRow: {
        padding: theme.spacing(2, 0)
    },
    itemName: {
        fontWeight: 500
    },
    itemValue: {
        fontWeight: 300
    },
    logOutButton: {
        marginTop: theme.spacing(2)
    }
}));