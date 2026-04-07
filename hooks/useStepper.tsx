'use client';

import { Step } from "@/components/forms/steps/AvailabilitySteps";
import { stepReducer } from "@/reducers";
import { useReducer } from "react";
import type { FieldValues, UseFormTrigger } from "react-hook-form";

export default function useStepper<Ctx, T extends FieldValues>(
  steps: Step<Ctx, T>[],
  trigger: UseFormTrigger<T>
) {
  const [state, dispatch] = useReducer(stepReducer, { index: 0 });

  const currentStep = steps[state.index];
  const isFirst = state.index === 0;
  const isLast = state.index === steps.length - 1;

  const onNext = async () => {
    const valid = await trigger(currentStep.fields);
    if (!valid) return false;

    dispatch({ type: "NEXT" });
    return true;
  };

  return {
    currentStep,
    controls: {
      index: state.index,
      isFirst,
      isLast,
      onNext,
      onBack: () => dispatch({ type: "BACK" }),
      resetStepper: () => dispatch({ type: "RESET" }),
    },
  };
}
