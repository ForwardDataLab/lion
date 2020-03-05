import React, {forwardRef} from "react";

import {TransitionProps} from "@material-ui/core/transitions";
import {Slide} from "@material-ui/core";
import FirstPageOutlinedIcon from "@material-ui/icons/FirstPageOutlined";
import LastPageOutlinedIcon from "@material-ui/icons/LastPageOutlined";
import KeyboardArrowRightOutlinedIcon from "@material-ui/icons/KeyboardArrowRightOutlined";
import KeyboardArrowLeftOutlinedIcon from "@material-ui/icons/KeyboardArrowLeftOutlined";
import ArrowUpwardOutlinedIcon from "@material-ui/icons/ArrowUpwardOutlined";
import {Icons} from "material-table";

export function SnackBarTransition(props: TransitionProps) {
    return <Slide {...props} direction="up"/>;
}

export const materialTableIcons: Icons = {
    FirstPage: forwardRef((props, ref) => <FirstPageOutlinedIcon {...props} ref={ref}/>),
    LastPage: forwardRef((props, ref) => <LastPageOutlinedIcon {...props} ref={ref}/>),
    NextPage: forwardRef((props, ref) => <KeyboardArrowRightOutlinedIcon {...props} ref={ref}/>),
    PreviousPage: forwardRef((props, ref) => <KeyboardArrowLeftOutlinedIcon {...props} ref={ref}/>),
    SortArrow: forwardRef((props, ref) => <ArrowUpwardOutlinedIcon {...props} ref={ref}/>),
};