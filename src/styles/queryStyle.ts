import {makeStyles, Theme} from "@material-ui/core/styles";
import {commonButtonStyles, commonPageStyles, errorButtonStyles, formStyles} from "./commonStyles";
import {grey} from "@material-ui/core/colors";

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