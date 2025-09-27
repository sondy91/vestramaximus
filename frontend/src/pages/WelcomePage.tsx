import { Flame, MoonStar, SunMedium } from 'lucide-react';

import { useTheme } from '@/components/theme/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

type WelcomePageProps = {
  onGetStarted: () => void;
};

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();
  const Icon = theme === 'dark' ? SunMedium : MoonStar;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="rounded-full border border-border/80 bg-background/60 shadow"
    >
      <Icon className="h-5 w-5" />
    </Button>
  );
};

const LogoMark = () => (
  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 text-primary">
    <Flame className="h-8 w-8" />
  </div>
);

export default function WelcomePage({ onGetStarted }: WelcomePageProps) {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.25),_transparent_60%)]" />
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-10">
        <header className="flex items-center justify-between">
          <span className="text-lg font-semibold tracking-wide text-muted-foreground">VestraMaximus</span>
          <ThemeToggleButton />
        </header>
        <main className="flex flex-1 items-center justify-center">
          <Card className="w-full max-w-2xl border-border/70 bg-card/80 backdrop-blur">
            <CardHeader className="space-y-4 text-center">
              <LogoMark />
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight">
                  Welcome to VestraMaximus
                </h1>
                <p className="text-base text-muted-foreground">
                  Local-first envelope budgeting for those who care about privacy and precision.
                </p>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <Button size="lg" className="min-w-[200px]" onClick={onGetStarted}>
                Get started
              </Button>
              <p className="text-sm text-muted-foreground">
                Streamline your budgets, track envelopes, and stay in control — all offline.
              </p>
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
