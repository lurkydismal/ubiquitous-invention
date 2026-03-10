"use client";

import { Box, Step, StepLabel, Stepper, Tooltip } from "@mui/material";
import { stepSx, Step as StepType } from "./types";

export default function DesktopStepper({
    activeStep,
    completedSteps,
    steps,
    completed,
    onClick,
}: {
    activeStep: number;
    completedSteps: number[];
    steps: StepType[];
    completed: boolean;
    onClick: (index: number, isActive: boolean, isCompleted: boolean) => void;
}) {
    return (
        <Box sx={{ display: { xs: "none", md: "block" }, mb: 2 }}>
            <Stepper nonLinear activeStep={activeStep} sx={{ px: 0 }}>
                {steps.map((step, index) => {
                    const isActive = index === activeStep;
                    const isCompleted = completedSteps.includes(index);
                    const tooltip = isActive
                        ? isCompleted
                            ? "Unmark completed"
                            : "Mark completed"
                        : "Step";

                    return (
                        <Step key={step.title} completed={isCompleted}>
                            {(() => {
                                const label = (
                                    <StepLabel
                                        sx={completed ? undefined : stepSx}
                                        onClick={
                                            completed
                                                ? undefined
                                                : () =>
                                                      onClick(
                                                          index,
                                                          isActive,
                                                          isCompleted,
                                                      )
                                        }
                                    >
                                        {step.title}
                                    </StepLabel>
                                );

                                return !completed ? (
                                    <Tooltip title={tooltip}>{label}</Tooltip>
                                ) : (
                                    label
                                );
                            })()}
                        </Step>
                    );
                })}
            </Stepper>
        </Box>
    );
}
