import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'metadata.privacy' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function PrivacyPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  unstable_setRequestLocale(locale);
  const t = await getTranslations('privacy');

  return (
    <main className="min-h-screen bg-white dark:bg-[#0b0f19] transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t('lastUpdated')}: {t('date')}
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t('intro.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t('intro.description')}
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t('collection.title')}
            </h2>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              {t('collection.analytics.title')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t('collection.analytics.description')}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-6">
              <li>{t('collection.analytics.items.pageViews')}</li>
              <li>{t('collection.analytics.items.location')}</li>
              <li>{t('collection.analytics.items.device')}</li>
              <li>{t('collection.analytics.items.browser')}</li>
              <li>{t('collection.analytics.items.referrer')}</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              {t('collection.newsletter.title')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t('collection.newsletter.description')}
            </p>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t('usage.title')}
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>{t('usage.items.improve')}</li>
              <li>{t('usage.items.understand')}</li>
              <li>{t('usage.items.newsletter')}</li>
              <li>{t('usage.items.communicate')}</li>
            </ul>
          </section>

          {/* Cookies */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t('cookies.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t('cookies.description')}
            </p>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              {t('cookies.types.title')}
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-4">
              <li>
                <strong>{t('cookies.types.essential.name')}:</strong>{' '}
                {t('cookies.types.essential.description')}
              </li>
              <li>
                <strong>{t('cookies.types.analytics.name')}:</strong>{' '}
                {t('cookies.types.analytics.description')}
              </li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300">
              {t('cookies.control')}
            </p>
          </section>

          {/* Third-Party Services */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t('thirdParty.title')}
            </h2>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Google Analytics
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t('thirdParty.ga.description')}{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {t('thirdParty.ga.link')}
              </a>
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Mailchimp
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t('thirdParty.mailchimp.description')}{' '}
              <a
                href="https://mailchimp.com/legal/privacy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {t('thirdParty.mailchimp.link')}
              </a>
            </p>
          </section>

          {/* Your Rights (GDPR) */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t('rights.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t('rights.description')}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>{t('rights.items.access')}</li>
              <li>{t('rights.items.rectification')}</li>
              <li>{t('rights.items.erasure')}</li>
              <li>{t('rights.items.restriction')}</li>
              <li>{t('rights.items.portability')}</li>
              <li>{t('rights.items.objection')}</li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t('security.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t('security.description')}
            </p>
          </section>

          {/* Changes to This Policy */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t('changes.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {t('changes.description')}
            </p>
          </section>

          {/* Contact */}
          <section className="mb-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t('contact.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t('contact.description')}
            </p>
            <p className="text-gray-900 dark:text-gray-100">
              <strong>{t('contact.email')}:</strong>{' '}
              <a
                href="mailto:hello.devpicon@gmail.com"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                hello.devpicon@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
