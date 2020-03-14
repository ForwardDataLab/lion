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
        backgroundColor: `rgba(236,239,241,0.8)`
    },
    sideInputTitle: {
        padding: 0,
        margin: theme.spacing(1, 0),
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
        position: `relative`
    },
    queryCreateInputPanel: {
        position: `absolute`,
        top: 0,
        bottom: 0,
        display: `none`
    },
    queryCreateVizPanel: {
        width: `100%`,
        height: `100%`
    }
}));