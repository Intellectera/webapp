import {styled} from "@mui/material/styles";
import StepConnector, {stepConnectorClasses} from "@mui/material/StepConnector";
import {StepIconProps} from "@mui/material/StepIcon";
import {Check} from "@mui/icons-material";
import * as React from "react";

export const CustomConnector = styled(StepConnector)(({theme}) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 10,
        left: 'calc(-50% + 16px)',
        right: 'calc(50% + 16px)',
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: theme.palette.primary.main,
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: theme.palette.primary.main,
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[400] : '#eaeaf0',
        borderTopWidth: 3,
        borderRadius: 1,
    },
}));

export const CustomStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(
    ({theme, ownerState}) => ({
        color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
        display: 'flex',
        height: 22,
        alignItems: 'center',
        ...(ownerState.active && {
            color: theme.palette.primary.main,
        }),
        '& .CustomStepIcon-completedIcon': {
            color: theme.palette.primary.lighter,
            backgroundColor: theme.palette.primary.main,
            borderRadius: '50%',
            padding: '3px',
            width: 20,
            height: 20,
            zIndex: 1,
            fontSize: 18,
        },
        '& .CustomStepIcon-circle': {
            width: 20,
            height: 20,
            borderRadius: '50%',
            backgroundColor: 'currentColor',
        },
    }),
);

export function CustomStepIcon(props: StepIconProps) {
    const {active, completed, className} = props;

    return (
        <CustomStepIconRoot ownerState={{active}} className={className}>
            {completed ? (
                <Check className="CustomStepIcon-completedIcon"/>
            ) : (
                <div className="CustomStepIcon-circle"/>
            )}
        </CustomStepIconRoot>
    );
}
