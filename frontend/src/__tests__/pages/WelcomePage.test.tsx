import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import WelcomePage from '../../pages/WelcomePage';
import { ThemeProvider } from '../../components/theme/ThemeProvider';

describe('WelcomePage', () => {
  beforeAll(() => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({
      matches: true,
      media: '(prefers-color-scheme: dark)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })));
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  const renderWelcome = () => {
    const onGetStarted = vi.fn();

    return {
      onGetStarted,
      user: userEvent.setup(),
      ...render(
        <ThemeProvider>
          <WelcomePage onGetStarted={onGetStarted} />
        </ThemeProvider>
      ),
    };
  };

  it('renders hero copy and primary action', async () => {
    const { onGetStarted, user } = renderWelcome();

    expect(
      screen.getByRole('heading', { name: /welcome to vestramaximus/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/local-first envelope budgeting for builders/i)
    ).toBeInTheDocument();

    const cta = screen.getByRole('button', { name: /get started/i });
    expect(cta).toBeInTheDocument();

    await user.click(cta);
    expect(onGetStarted).toHaveBeenCalledTimes(1);
  });

  it('toggles dark mode when the theme switch is clicked', async () => {
    const { user } = renderWelcome();

    const toggle = screen.getByRole('button', { name: /toggle theme/i });
    expect(toggle).toBeInTheDocument();
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    await user.click(toggle);

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
