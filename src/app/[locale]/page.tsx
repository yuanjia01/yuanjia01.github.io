import HeroSection from "@/components/HeroSection";
import LatestContentSection from "@/components/LatestContentSection";
import contentData from "@/data/content.json";
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';

interface FocusCard {
  title: string;
  description: string;
  href?: string;
}

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'metadata.home' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function Home({ params }: { params: { locale: string } }) {
  const { locale } = params;
  unstable_setRequestLocale(locale);
  const focusT = await getTranslations({ locale, namespace: 'CurrentFocus' });

  const focusCards: FocusCard[] = [
    {
      title: focusT('aiLabsTitle'),
      description: focusT('aiLabsDesc'),
      href: 'https://github.com/DevPicon/ondevice-ai-labs',
    },
    {
      title: focusT('sslTitle'),
      description: focusT('sslDesc'),
      href: 'https://github.com/DevPicon/ssl-pinning-hands-on',
    },
    {
      title: focusT('kmpTitle'),
      description: focusT('kmpDesc'),
    },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-[#0b0f19] transition-colors duration-300">
      <HeroSection />
      <section id="focus" className="border-y border-gray-200 bg-gray-50/80 px-4 py-16 dark:border-gray-800 dark:bg-gray-900/30 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900 dark:text-gray-100 md:text-4xl">
            {focusT('title')}
          </h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {focusCards.map((card) => {
              const className = "block h-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 dark:border-gray-700 dark:bg-gray-800";
              const interactiveClassName = `${className} hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl dark:hover:border-blue-500`;

              if (card.href) {
                return (
                  <a
                    key={card.title}
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={interactiveClassName}
                  >
                    <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-gray-100">
                      {card.title}
                    </h3>
                    <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                      {card.description}
                    </p>
                  </a>
                );
              }

              return (
                <div key={card.title} className={className}>
                  <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-gray-100">
                    {card.title}
                  </h3>
                  <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <LatestContentSection contentData={contentData.latestContent} />
    </main>
  );
}
