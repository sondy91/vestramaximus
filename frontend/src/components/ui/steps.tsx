import { cn } from '@/lib/utils';

export type Step = {
  id: number;
  label: string;
};

export interface StepsProps {
  steps: Step[];
  current: number;
}

export function Steps({ steps, current }: StepsProps) {
  return (
    <div className="flex items-center gap-2" role="group" aria-label="Onboarding steps">
      {steps.map((step) => {
        const isActive = step.id === current;
        return (
          <div
            key={step.id}
            aria-label={`Wizard step ${step.id}`}
            data-active={isActive}
            role="presentation"
            className={cn(
              'h-2 w-2 rounded-full transition-colors duration-200',
              isActive ? 'bg-primary/90' : 'bg-muted'
            )}
          />
        );
      })}
    </div>
  );
}
