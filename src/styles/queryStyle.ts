import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {commonButtonStyles, commonPageStyles, errorButtonStyles, formStyles} from "./commonStyles";
import {grey, red} from "@material-ui/core/colors";

export const queryStyles = makeStyles((theme: Theme) => ({
    ...commonPageStyles(theme),
    ...errorButtonStyles(theme),
    ...commonButtonStyles(theme),
    ...formStyles(theme)
}));

export const queryCreateStyles = makeStyles((theme: Theme) => ({
    ...commonPageStyles(theme),
    ...errorButtonStyles(theme),
    ...commonButtonStyles(theme),
    ...formStyles(theme),
    sideInputWrapper: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(2),
        backgroundColor: `rgba(236,239,241,0.8)`,
        width: `100%`,
        minHeight: `100%`,
        boxSizing: `border-box`,
        borderTopLeftRadius: `10px`,
        borderBottomLeftRadius: `10px`
    },
    sideInputTitle: {
        padding: 0,
        margin: theme.spacing(1.5, 0),
        wordBreak: `break-word`
    },
    sideInputFields: {
        margin: theme.spacing(0.5, 0)
    },
    sideFieldWrapper: {
        width: `100%`,
        height: `100%`
    },
    sideEmptyText: {
        color: grey["900"]
    },
    queryCreateWrapper: {
        width: `100%`,
        height: `100%`,
        position: `relative`,
        marginTop: theme.spacing(4)
    },
    queryCreateInputPanel: {
        width: `240px`,
        maxWidth:  `30%`,
        position: `absolute`,
        top: 0,
        bottom: 0,
        overflow: `auto`
    },
    queryCreateVizPanel: {
        width: `100%`,
        height: `100%`,
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: `10px`
    },
    formSubmitSpacing: {
        marginTop: theme.spacing(4)
    }
}));


export const queryHistoryStyles = makeStyles((theme: Theme) => createStyles({
    ...commonPageStyles(theme),
    ...errorButtonStyles(theme),
    ...commonButtonStyles(theme),
    ...formStyles(theme),
    historyWrapper: {
        width: `100%`,
        maxHeight: `calc(100vh - 70px - 2.5rem - 32px - 32px - 10px)`, // appbar - title - top padding - bottom padding - extra spacing
        display: `flex`,
        flexDirection: `column`
    },
    tabsWrapper: {
        padding: `1rem`,
        borderBottom: `1px solid #F5F5F5`
    },
    tabPanelWrapper: {
        height: `100%`,
        display: `flex`,
        flexDirection: `column`,
        overflowY: `hidden`
    },
    intermediateWrapper: {
        height: `100%`,
        display: `flex`,
        flexDirection: `column`,
        overflowY: `hidden`
    },
    historyPanelWrapper: {
        height: `100%`,
        width: `100%`,
        display: `flex`,
        flexDirection: `row`,
        overflowY: `hidden`
    },
    historyTableWrapper: {
        width: `30vw`,
        overflowY: `auto`,
        flexShrink: 0
    },
    historyTable: {
        borderRight: `1px solid ${grey["100"]}`
    },
    historyTableHighlightedRow: {
        backgroundColor: grey["100"]
    },

    responseVizWrapper: {
        width: `100%`,
        alignSelf: `stretch`,
        display: `flex`,
        flexDirection: `column`,
        alignItems: `center`,
        justifyContent: `center`,
    },
    responseVizTextWrapper: {
        display: `flex`,
        flexDirection: `column`,
        alignItems: `center`,
        justifyContent: `center`,
        width: `100%`,
        height: `100%`
    },
    responseVizEmptyTitle: {
        color: grey["400"],
    },
    responseVizErrorTitle: {
        color: red["400"],
    },
    responseVizOutline: {
        width: `calc(100% - 4px - 4px)`,
        alignSelf: `stretch`,
        margin: `4px`,
        border: `1px solid ${grey["100"]}`
    },

    detailPanelWrapper: {
        width: `100%`,
        boxSizing: `border-box`,
        padding: theme.spacing(1),
        display: `flex`,
        flexDirection: `column`,
        overflowY: `auto`
    },
    detailHelperText: {
        padding: 0,
        margin: theme.spacing(1, 0.5),
        color: grey["400"],
        fontSize: `0.8rem`
    },
    detailTable: {
        flexShrink: 0,
        paddingBottom: theme.spacing(1),
        borderBottom: `1px solid ${grey["100"]}`,
        marginBottom: theme.spacing(1),
    },
    detailVizOutline: {
        width: `calc(100% - 3rem)`,
        alignSelf: `stretch`,
        margin: `1rem 1.5rem`,
        border: `1px solid ${grey["100"]}`
    }
}));