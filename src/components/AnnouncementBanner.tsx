'use client';

import { useState, useEffect } from 'react';
import { X, Trophy } from 'lucide-react';
import { useTranslations } from 'next-intl';

const DISMISSED_KEY = 'golden-kodee-banner-dismissed';
const DEADLINE = new Date('2026-03-22T23:59:59');

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations('announcementBanner');

  useEffect(() => {
    const isDismissed = localStorage.getItem(DISMISSED_KEY);
    const isExpired = new Date() > DEADLINE;
    if (!isDismissed && !isExpired) {
      setIsVisible(true);
      document.documentElement.style.setProperty('--announcement-height', '2.5rem');
    } else {
      document.documentElement.style.setProperty('--announcement-height', '0px');
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setIsVisible(false);
    document.documentElement.style.setProperty('--announcement-height', '0px');
  };

  if (!isVisible) return null;

  return (
    <div className="h-10 flex items-center px-4 bg-purple-950 border-b border-purple-800">
      <div className="flex items-center gap-2 flex-1 justify-center min-w-0">
        <Trophy size={14} className="text-yellow-400 shrink-0" />
        <p className="text-xs text-purple-100 truncate">
          <span className="hidden sm:inline">{t('text')}</span>
          <span className="sm:hidden">{t('textShort')}</span>
        </p>
        <a
          href="https://kotl.in/f273m4"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 ml-1 px-3 py-0.5 bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold rounded-full transition-colors duration-200"
        >
          {t('cta')}
        </a>
      </div>
      <button
        onClick={dismiss}
        aria-label={t('dismiss')}
        className="shrink-0 ml-2 text-purple-400 hover:text-white transition-colors duration-200"
      >
        <X size={14} />
      </button>
    </div>
  );
}
