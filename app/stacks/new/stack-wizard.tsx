"use client";

import { useState, useEffect, useCallback } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { STACK_LAYERS } from "@/lib/stack-layers";
import { WizardProgress } from "@/components/stacks/wizard-progress";
import { WizardStep } from "@/components/stacks/wizard-step";
import { WizardSummary } from "@/components/stacks/wizard-summary";

const TOTAL_STEPS = STACK_LAYERS.length;
const SUMMARY_STEP = TOTAL_STEPS;

export function StackWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<
    Record<string, Id<"tools">[]>
  >({});
  const [visitorId, setVisitorId] = useState("");

  useEffect(() => {
    let id = localStorage.getItem("stackatlas-visitor-id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("stackatlas-visitor-id", id);
    }
    setVisitorId(id);
  }, []);

  const completedSteps = new Set(
    STACK_LAYERS.map((_, i) => i).filter(
      (i) => (selections[STACK_LAYERS[i].key]?.length ?? 0) > 0
    )
  );

  const handleSelect = useCallback(
    (toolIds: Id<"tools">[]) => {
      const layerKey = STACK_LAYERS[currentStep].key;
      setSelections((prev) => ({ ...prev, [layerKey]: toolIds }));
    },
    [currentStep]
  );

  const goNext = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, SUMMARY_STEP));
  }, []);

  const goBack = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < TOTAL_STEPS) {
      setCurrentStep(step);
    }
  }, []);

  const isSummary = currentStep === SUMMARY_STEP;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Build Your Tech Stack
        </h1>
        <p className="text-muted-foreground mt-1">
          Pick the best tools for each layer of your product — step by step.
        </p>
      </div>

      <WizardProgress
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={goToStep}
      />

      {isSummary ? (
        <WizardSummary
          selections={selections}
          visitorId={visitorId}
          onBack={goBack}
        />
      ) : (
        <WizardStep
          stepIndex={currentStep}
          selectedToolIds={selections[STACK_LAYERS[currentStep].key] ?? []}
          onSelect={handleSelect}
          onNext={goNext}
          onBack={goBack}
          onSkip={goNext}
          isFirst={currentStep === 0}
          isLast={currentStep === TOTAL_STEPS - 1}
        />
      )}
    </div>
  );
}
