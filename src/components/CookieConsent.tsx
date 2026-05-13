'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const locale = useLocale();
  const t = useTranslations('cookieConsent');

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);

    // Enable Google Analytics with proper consent update
    if (typeof window !== 'undefined') {
      // Initialize dataLayer if not exists
      window.dataLayer = window.dataLayer || [];

      // Define gtag function if not exists
      if (!window.gtag) {
        window.gtag = function() {
          window.dataLayer!.push(arguments);
        };
      }

      // Update consent
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });

      console.log('Consent updated to granted');
    }
  };

  const rejectCookies = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setShowBanner(false);

    // Keep Analytics disabled
    if (typeof window !== 'undefined') {
      // Initialize dataLayer if not exists
      window.dataLayer = window.dataLayer || [];

      // Define gtag function if not exists
      if (!window.gtag) {
        window.gtag = function() {
          window.dataLayer!.push(arguments);
        };
      }

      // Explicitly deny consent
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });

      console.log('Consent updated to denied');
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-white dark:bg-gray-800 border-t-2 border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {t('title')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('description')}{' '}
              <a
                href={`/${locale}/privacy`}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {t('learnMore')}
              </a>
            </p>
          </div>

          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={rejectCookies}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              {t('reject')}
            </button>
            <button
              onClick={acceptCookies}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors"
            >
              {t('accept')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
