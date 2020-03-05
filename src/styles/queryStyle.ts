import {makeStyles, Theme} from "@material-ui/core/styles";
import {commonButtonStyles, commonPageStyles, errorButtonStyles, formStyles} from "./commonStyles";

export const queryStyles = makeStyles((theme: Theme) => ({
    ...commonPageStyles(theme),
    ...errorButtonStyles(theme),
    ...commonButtonStyles(theme),
    ...formStyles(theme)
}));

export const queryCreateStyle = makeStyles((theme: Theme) => ({
    ...commonPageStyles(theme),
    ...errorButtonStyles(theme),
    ...commonButtonStyles(theme),
    ...formStyles(theme),

}));