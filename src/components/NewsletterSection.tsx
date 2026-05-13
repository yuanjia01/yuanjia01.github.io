'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function NewsletterSection() {
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('contact.newsletter');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = () => {
    // Track newsletter subscription in Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'newsletter_subscription', {
        event_category: 'engagement',
        event_label: 'Newsletter Form',
        value: 1
      });
    }
  };

  if (!mounted) {
    return (
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                📬 Suscríbete a mi newsletter
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Recibe contenido exclusivo directamente en tu inbox
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12 border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", duration: 0.5, delay: 0.2 }}
              >
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                {t('title')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {t('description')}
              </p>
            </div>

            {/* Benefits */}
            <div className="mb-8">
              <ul className="space-y-3">
                {['podcast', 'articles', 'tips', 'news'].map((benefit, index) => (
                  <motion.li
                    key={benefit}
                    className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  >
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{t(`benefits.${benefit}`)}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Mailchimp Form */}
            <div id="mc_embed_shell">
              <div id="mc_embed_signup">
                <form
                  action="https://github.us13.list-manage.com/subscribe/post?u=155d4941c6b00592b5ab84670&amp;id=7ca69d6c55&amp;f_id=0063f1e1f0"
                  method="post"
                  id="mc-embedded-subscribe-form"
                  name="mc-embedded-subscribe-form"
                  className="validate"
                  target="_blank"
                  onSubmit={handleSubmit}
                >
                  <div id="mc_embed_signup_scroll" className="space-y-4">
                    <div className="mc-field-group">
                      <label htmlFor="mce-EMAIL" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('form.email')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="EMAIL"
                        className="required email w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        id="mce-EMAIL"
                        required
                        placeholder={t('form.placeholder.email')}
                      />
                    </div>
                    <div id="mce-responses" className="clear foot">
                      <div className="response" id="mce-error-response" style={{display: 'none'}}></div>
                      <div className="response" id="mce-success-response" style={{display: 'none'}}></div>
                    </div>
                    <div aria-hidden="true" style={{position: 'absolute', left: '-5000px'}}>
                      <input type="text" name="b_730ef9e57c1bea37882813fec_5f57a7d612" tabIndex={-1} />
                    </div>
                    <div className="optionalParent">
                      <div className="clear foot">
                        <button
                          type="submit"
                          name="subscribe"
                          id="mc-embedded-subscribe"
                          className="button w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-250 flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {t('form.submit')}
                        </button>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                          {t('form.privacy')}
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Stats (optional, can add later) */}
            {/* <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                📊 +1,234 desarrolladores ya están suscritos
              </p>
            </div> */}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
