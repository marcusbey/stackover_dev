"use client";

import { STACK_LAYERS } from "@/lib/stack-layers";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import {
  Globe2,
  Server,
  Layout,
  Database,
  Shield,
  CreditCard,
  BarChart3,
  Mail,
  Activity,
  GitBranch,
  FileText,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  "globe-2": Globe2,
  server: Server,
  layout: Layout,
  database: Database,
  shield: Shield,
  "credit-card": CreditCard,
  "bar-chart-3": BarChart3,
  mail: Mail,
  activity: Activity,
  "git-branch": GitBranch,
  "file-text": FileText,
};

interface WizardProgressProps {
  currentStep: number;
  completedSteps: Set<number>;
  onStepClick: (step: number) => void;
}

export function WizardProgress({
  currentStep,
  completedSteps,
  onStepClick,
}: WizardProgressProps) {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-center gap-1 min-w-max px-1">
        {STACK_LAYERS.map((layer, index) => {
          const IconComponent = ICON_MAP[layer.icon] ?? Globe2;
          const isCompleted = completedSteps.has(index);
          const isCurrent = currentStep === index;

          return (
            <button
              key={layer.key}
              onClick={() => onStepClick(index)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap",
                isCurrent &&
                  "bg-primary text-primary-foreground shadow-sm",
                isCompleted &&
                  !isCurrent &&
                  "bg-primary/10 text-primary",
                !isCurrent &&
                  !isCompleted &&
                  "text-muted-foreground hover:bg-muted"
              )}
            >
              {isCompleted && !isCurrent ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <IconComponent className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline">{layer.title}</span>
              <span className="sm:hidden">{index + 1}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
