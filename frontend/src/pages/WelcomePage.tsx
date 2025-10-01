import { CreditCard, Flame, MoonStar, Shield, Target, FileText, Sparkles, SunMedium } from 'lucide-react';
import { useState } from 'react';

import { useTheme } from '@/components/theme/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Steps } from '@/components/ui/steps';

type WelcomePageProps = {
  onGetStarted: () => void;
};

type OnboardingData = {
  accentColor: string;
  themeMode: 'light' | 'dark';
  goals: string[];
  categories: string[];
};


const LogoMark = () => (
  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 text-primary">
    <Flame className="h-8 w-8" />
  </div>
);

export default function WelcomePage({ onGetStarted }: WelcomePageProps) {
  const { theme, setTheme, accentColor, setAccentColor } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    accentColor,
    themeMode: theme,
    goals: [],
    categories: [],
  });

  const goalOptions = [
    { id: 'debt', label: 'Pay off debt', Icon: CreditCard },
    { id: 'emergency', label: 'Build an emergency fund', Icon: Shield },
    { id: 'savings', label: 'Save for a goal', Icon: Target },
    { id: 'budget', label: 'Create a budget', Icon: FileText },
    { id: 'other', label: 'Something else', Icon: Sparkles },
  ];

  const toggleGoal = (goalId: string) => {
    setOnboardingData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter((g) => g !== goalId)
        : [...prev.goals, goalId],
    }));
  };

  const starterCategories = [
    { id: 'groceries', label: 'Groceries', Icon: Target },
    { id: 'rent', label: 'Rent/Mortgage', Icon: Shield },
    { id: 'utilities', label: 'Utilities', Icon: Sparkles },
    { id: 'transportation', label: 'Transportation', Icon: CreditCard },
    { id: 'entertainment', label: 'Entertainment', Icon: FileText },
    { id: 'savings', label: 'Savings', Icon: Target },
  ];

  const toggleCategory = (categoryId: string) => {
    setOnboardingData((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((c) => c !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  const steps = [
    { id: 1, label: 'Welcome' },
    { id: 2, label: 'Customize' },
    { id: 3, label: 'Goals' },
    { id: 4, label: 'Categories' },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onGetStarted();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.25),_transparent_60%)]" />
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-10">
        <header className="flex items-center justify-between">
          <span className="text-lg font-semibold tracking-wide text-muted-foreground">VestraMaximus</span>
        </header>
        <main className="flex flex-1 items-center justify-center">
          <Card className="w-full max-w-2xl border-border/70 bg-card/80 backdrop-blur">
            <CardHeader className="space-y-4 text-center">
              <LogoMark />
              {currentStep === 1 && (
                <div className="space-y-3">
                  <h1 className="text-3xl font-semibold tracking-tight">
                    Welcome to VestraMaximus
                  </h1>
                  <p className="text-base text-muted-foreground">
                    Streamline your budgets, track envelopes, and stay in control — all offline.
                  </p>
                </div>
              )}
              {currentStep === 2 && (
                <div className="space-y-3">
                  <h1 className="text-3xl font-semibold tracking-tight">
                    Customize your experience
                  </h1>
                  <p className="text-base text-muted-foreground">
                    Choose an accent color and theme mode that suits your style.
                  </p>
                </div>
              )}
              {currentStep === 3 && (
                <div className="space-y-3">
                  <h1 className="text-3xl font-semibold tracking-tight">
                    What are your goals?
                  </h1>
                  <p className="text-base text-muted-foreground">
                    Select all that apply to personalize your experience.
                  </p>
                </div>
              )}
              {currentStep === 4 && (
                <div className="space-y-3">
                  <h1 className="text-3xl font-semibold tracking-tight">
                    Choose starter categories
                  </h1>
                  <p className="text-base text-muted-foreground">
                    Select categories to help build your first budget.
                  </p>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex flex-col min-h-[420px]">
              <div className="flex-1 flex flex-col items-center justify-center">
              {currentStep === 1 && (
                <div className="text-center">
                  {/* Content only, button moved to bottom */}
                </div>
              )}
              {currentStep === 2 && (
                <div className="w-full">
                  <div className="space-y-3">
                    <label className="block text-sm text-center font-medium">Accent color</label>
                    <div className="flex gap-3 justify-center">
                      {['indigo', 'blue', 'green', 'purple', 'pink'].map((color) => (
                        <button
                          key={color}
                          onClick={() => {
                            setOnboardingData({ ...onboardingData, accentColor: color });
                            setAccentColor(color);
                          }}
                          className={`h-10 w-10 rounded-full transition-all ${
                            onboardingData.accentColor === color
                              ? 'ring-2 ring-offset-2 ring-primary scale-110'
                              : 'hover:scale-105'
                          }`}
                          style={{
                            backgroundColor:
                              color === 'indigo'
                                ? '#6366f1'
                                : color === 'blue'
                                ? '#3b82f6'
                                : color === 'green'
                                ? '#10b981'
                                : color === 'purple'
                                ? '#a855f7'
                                : '#ec4899',
                          }}
                          aria-label={`Select ${color} accent`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3 mt-6">
                    <label className="block text-sm text-center font-medium">Theme mode</label>
                    <div className="flex gap-3 justify-center">
                      <Button
                        variant={onboardingData.themeMode === 'light' ? 'default' : 'outline'}
                        onClick={() => {
                          setOnboardingData({ ...onboardingData, themeMode: 'light' });
                          setTheme('light');
                        }}
                        className="min-w-[120px]"
                      >
                        <SunMedium className="mr-2 h-4 w-4" />
                        Light
                      </Button>
                      <Button
                        variant={onboardingData.themeMode === 'dark' ? 'default' : 'outline'}
                        onClick={() => {
                          setOnboardingData({ ...onboardingData, themeMode: 'dark' });
                          setTheme('dark');
                        }}
                        className="min-w-[120px]"
                      >
                        <MoonStar className="mr-2 h-4 w-4" />
                        Dark
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              {currentStep === 3 && (
                <div className="w-full max-w-md">
                  <div className="grid grid-cols-1 gap-3">
                    {goalOptions.map((goal) => {
                      const isSelected = onboardingData.goals.includes(goal.id);
                      const IconComponent = goal.Icon;
                      return (
                        <button
                          key={goal.id}
                          onClick={() => toggleGoal(goal.id)}
                          className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all ${
                            isSelected
                              ? 'border-primary bg-primary/10 shadow-sm'
                              : 'border-border hover:border-primary/50 hover:bg-accent/50'
                          }`}
                          aria-label={`Select goal: ${goal.label}`}
                        >
                          <IconComponent className="h-5 w-5 text-muted-foreground" />
                          <span className="flex-1 font-medium">{goal.label}</span>
                          {isSelected && (
                            <span className="text-primary text-xl">✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {currentStep === 4 && (
                <div className="w-full max-w-md">
                  <div className="grid grid-cols-2 gap-3">
                    {starterCategories.map((category) => {
                      const isSelected = onboardingData.categories.includes(category.id);
                      const IconComponent = category.Icon;
                      return (
                        <button
                          key={category.id}
                          onClick={() => toggleCategory(category.id)}
                          className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 text-center transition-all ${
                            isSelected
                              ? 'border-primary bg-primary/10 shadow-sm'
                              : 'border-border hover:border-primary/50 hover:bg-accent/50'
                          }`}
                          aria-label={`Select category: ${category.label}`}
                        >
                          <IconComponent className="h-6 w-6 text-muted-foreground" />
                          <span className="text-sm font-medium">{category.label}</span>
                          {isSelected && (
                            <span className="text-primary text-lg">✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              </div>
              <div className="mt-auto pt-6 space-y-4">
                <div className="flex gap-3 justify-center">
                  {currentStep === 1 && (
                    <Button size="lg" className="min-w-[200px]" onClick={handleNext}>
                      Get started
                    </Button>
                  )}
                  {currentStep > 1 && (
                    <>
                      <Button variant="outline" onClick={handleBack}>
                        Back
                      </Button>
                      <Button onClick={handleNext} className="min-w-[120px]">
                        {currentStep === steps.length ? 'Complete' : 'Continue'}
                      </Button>
                    </>
                  )}
                </div>
                <div className="flex justify-center">
                  <Steps steps={steps} current={currentStep} />
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
        <footer className="mt-10 flex justify-center text-xs text-muted-foreground">
          <span>Built for focused builders • Fully local • Privacy-first</span>
        </footer>
      </div>
    </div>
  );
}
