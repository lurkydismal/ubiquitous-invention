"use client";

import WriteForm from "./WriteForm";
import SettionsForm from "./SettingsForm";
import { Activity, useEffect, useState } from "react";
import { Box } from "@mui/material";
import FinalStep from "./FinalStep";
import MobileStepper from "./MobileStepper";
import { FormValues, Step as StepType } from "./types";
import DesktopStepper from "./DesktopStepper";
import { createPost } from "@/lib/post";
import { postNewSchema } from "@/utils/validate/schemas";
import log from "@/utils/stdlog";
import { useSnackbar } from "@/providers/snackbar";
import { FormProvider, Path, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function MainContent() {
    const { showError } = useSnackbar();
    const methods = useForm<FormValues>({
        resolver: zodResolver(postNewSchema),
        defaultValues: {
            // Write form
            title: "",
            description: "",
            content: "",
            "reading-time": 0,

            // Settings form
            visibility: "public",
            "content-warning": false,
            category: "",
            publish: "now",
            "co-author": "",
            "attribution-note": "",
        },
    });
    const [activeStep, setActiveStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [completed, setCompleted] = useState(false);

    const steps: StepType[] = [
        {
            title: "Write",
            fields: ["title", "description", "content"],
            item: <WriteForm />,
        },
        {
            title: "Settings",
            fields: [
                "visibility",
                "content-warning",
                "category",
                "publish",
                "co-author",
                "attribution-note",
            ],
            item: <SettionsForm />,
        },
    ];

    const validateStep = async (fields: Path<FormValues>[]) => {
        const valid = await methods.trigger(fields);

        // show visual feedback for all fields in this step
        fields.forEach((f) => {
            const error = methods.getFieldState(f).error;
            if (error) showError(`${error.message}`);
        });

        return valid;
    };

    const handleReset = () => {
        setActiveStep(0);
        setCompletedSteps([]);
        setCompleted(false);
    };

    const addCompletedStep = async (index: number) => {
        try {
            const isValid = await validateStep(steps[index].fields); // validate without submitting

            if (isValid) setCompletedSteps((prev) => [...prev, index]);
        } catch {
            // validation failed, RHF already shows errors
        }
    };

    const removeCompletedStep = (value: number) => {
        setCompletedSteps(completedSteps.filter((n) => n !== value));
    };

    const handleClick = (
        index: number,
        isActive: boolean,
        isCompleted: boolean,
    ) => {
        if (!isActive) {
            setActiveStep(index);
        } else {
            if (!isCompleted) addCompletedStep(index);
            else removeCompletedStep(index);
        }
    };

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            const parsed = postNewSchema.parse(data);

            await createPost(data);

            setCompleted(true);
            setActiveStep(steps.length);
        } catch (err) {
            showError(err);
        }
    };

    useEffect(() => {
        const allCompleted = completedSteps.length === steps.length;

        if (allCompleted) methods.handleSubmit(onSubmit)();
    }, [completedSteps, steps, methods.handleSubmit, onSubmit]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "100%",
                px: { xs: 0, sm: 2 },
            }}
        >
            {/* Header */}
            <DesktopStepper
                activeStep={activeStep}
                completedSteps={completedSteps}
                steps={steps}
                completed={completed}
                onClick={handleClick}
            />

            {/* Main content area - grows and scrolls if necessary */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    flexGrow: 1,
                    minHeight: 0, // allow proper overflow within flex children
                    overflow: "auto",
                    maxHeight:
                        "calc(100dvh - var(--template-frame-height, 0px) - 220px)", // optional safeguard
                }}
            >
                <MobileStepper
                    activeStep={activeStep}
                    completedSteps={completedSteps}
                    steps={steps}
                    completed={completed}
                    onClick={handleClick}
                />

                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <FormProvider {...methods}>
                        {/* Current step content */}
                        {steps.map((item, index) => (
                            <Activity
                                key={`${item.title}-${index}`}
                                mode={
                                    index === activeStep ? "visible" : "hidden"
                                }
                            >
                                {item.item}
                            </Activity>
                        ))}
                    </FormProvider>
                </form>

                <Activity mode={completed ? "visible" : "hidden"}>
                    <FinalStep onReset={handleReset} />
                </Activity>
            </Box>
        </Box>
    );
}
