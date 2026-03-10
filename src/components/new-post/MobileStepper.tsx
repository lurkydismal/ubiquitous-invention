import { Step, StepLabel, Stepper, Tooltip } from "@mui/material";
import { Step as StepType } from "./types";

export default function MobileStepper({
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
        <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{ display: { sm: "flex", md: "none" } }}
        >
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
                                    sx={{
                                        ".MuiStepLabel-labelContainer": {
                                            maxWidth: "70px",
                                        },
                                    }}
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
    );
}
