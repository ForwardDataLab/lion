import {makeStyles, Theme} from "@material-ui/core/styles";
import {commonPageStyles} from "./commonStyles";

export const serverStyles = makeStyles((theme: Theme) => ({
    ...commonPageStyles(theme),
    detailPanelItemTitle: {
        fontWeight: 500
    },
    detailPanelItemContent: {},
    buttonWrapper: {
        display: 'flex',
        flexDirection: 'row'
    },
    buttonRightEnd: {
        marginLeft: 'auto'
    },
    form: {
        margin: `${theme.spacing(2)}, 0`
    },
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