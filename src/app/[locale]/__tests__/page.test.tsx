import { render, screen } from '@testing-library/react';
import Home from '../page';

jest.mock('@/components/HeroSection', () => function MockHeroSection() {
  return <section>Hero</section>;
});

jest.mock('@/components/LatestContentSection', () => function MockLatestContentSection() {
  return <section>Latest Content</section>;
});

describe('Home page focus section', () => {
  it('renders focus project links with the correct GitHub hrefs', async () => {
    const page = await Home({ params: Promise.resolve({ locale: 'es' }) });

    render(page);

    expect(screen.getByRole('heading', { name: 'En qué estoy trabajando ahora' })).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /on-device ai labs/i })).toHaveAttribute(
      'href',
      'https://github.com/DevPicon/ondevice-ai-labs'
    );
    expect(screen.getByRole('link', { name: /ssl pinning hands-on/i })).toHaveAttribute(
      'href',
      'https://github.com/DevPicon/ssl-pinning-hands-on'
    );
  });
});
