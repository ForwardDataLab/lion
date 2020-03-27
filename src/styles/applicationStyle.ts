import {makeStyles, Theme} from "@material-ui/core/styles";
import {commonButtonStyles, commonPageStyles, errorButtonStyles, formStyles} from "./commonStyles";

export const applicationStyles = makeStyles((theme: Theme) => ({
    ...commonPageStyles(theme),
    ...errorButtonStyles(theme),
    ...commonButtonStyles(theme),
    ...formStyles(theme),
    submitButtonWrapper: {
        marginTop: theme.spacing(4)
    }
}));