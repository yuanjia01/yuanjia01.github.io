'use client';

import { Github, Linkedin, Instagram, Twitter, Youtube } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      url: 'https://github.com/devpicon',
      color: 'hover:text-gray-400',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://linkedin.com/in/devpicon',
      color: 'hover:text-blue-400',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/devpicon',
      color: 'hover:text-pink-400',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: 'https://twitter.com/devpicon',
      color: 'hover:text-sky-400',
    },
    {
      name: 'YouTube',
      icon: Youtube,
      url: 'https://youtube.com/@devpicon',
      color: 'hover:text-red-400',
    },
  ];

  return (
    <footer className="bg-white dark:bg-[#0b0f19] border-t border-gray-200 dark:border-gray-800 py-8 mt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Social Links */}
        <div className="flex justify-center space-x-6 mb-6">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-gray-500 dark:text-gray-400 ${link.color} transition-colors duration-250`}
                aria-label={link.name}
              >
                <Icon size={24} />
              </a>
            );
          })}
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 dark:text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Armando Picón. {t('rights')}.</p>
          <p className="mt-2">
            {t('madeWith')}{' '}
            <span className="text-red-500" aria-label={t('love')}>
              ❤️
            </span>{' '}
            {t('and')}{' '}
            <span className="text-accent-blue" aria-label={t('code')}>
              {t('code')}
            </span>
          </p>
          <p className="mt-3">
            <Link
              href={`/${locale}/privacy`}
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {t('privacy')}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
