import {makeStyles, Theme} from "@material-ui/core/styles";
import {commonButtonStyles, commonPageStyles, errorButtonStyles, formStyles} from "./commonStyles";


export const serverStyles = makeStyles((theme: Theme) => ({
    ...commonPageStyles(theme),
    ...errorButtonStyles(theme),
    ...commonButtonStyles(theme),
    ...formStyles(theme),
    detailPanelItemTitle: {
        fontWeight: 500
    },
    detailPanelItemContent: {},
    grid: {
        maxWidth: '100%',
    },
    indentedGrid: {
        padding: theme.spacing(2, 0, 2, 10)
    },
    indentedGridItem: {
        marginLeft: theme.spacing(4)
    }
}));