import { render, screen } from '@testing-library/react';
import HeroSection from '../HeroSection';

jest.mock('../AnimatedText', () => function MockAnimatedText({ phrases }: { phrases: string[] }) {
  return <span>{phrases.join(' | ')}</span>;
});

describe('HeroSection', () => {
  it('renders without errors', () => {
    render(<HeroSection />);

    expect(screen.getByRole('heading', { name: /hola, soy armando/i })).toBeInTheDocument();
  });

  it('renders the senior mobile role and the new status badges', async () => {
    render(<HeroSection />);

    expect((await screen.findAllByText(/Senior Mobile Developer/)).length).toBeGreaterThan(0);
    expect(
      screen.getByText('📍 Actualmente en Múnich por los Golden Kodee Awards 2026 (finalista en In-Person Presence).')
    ).toBeInTheDocument();
    expect(screen.getByText('🟢 Abierto a nuevos roles Tech Lead / Senior Mobile.')).toBeInTheDocument();
  });
});
