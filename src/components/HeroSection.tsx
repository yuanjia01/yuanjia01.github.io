'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import AnimatedText from './AnimatedText';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('home.hero');

  const roles = [
    t('roles.mobileDev'),
    t('roles.androidEng'),
    t('roles.techLead'),
    t('roles.speaker'),
    t('roles.designer'),
    t('roles.contentCreator'),
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full bg-gradient-to-br from-accent-blue to-accent-yellow p-1">
              <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-6xl">
                👨‍💻
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-4">
            {t('greeting')}{' '}
            <span className="bg-gradient-to-r from-accent-blue to-accent-yellow bg-clip-text text-transparent">
              {t('name')}
            </span>
          </h1>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          {/* Avatar - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-shrink-0"
          >
            <div className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full bg-gradient-to-br from-accent-blue to-accent-yellow p-1 shadow-2xl">
              <div className="w-full h-full rounded-full overflow-hidden bg-white">
                <Image
                  src="/avatar-optimized.png"
                  alt="Armando Picón"
                  width={800}
                  height={800}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>
          </motion.div>

          {/* Text Content - Right Side */}
          <div className="flex-1 text-center md:text-left max-w-2xl">
            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4"
            >
              {t('greeting')}{' '}
              <span className="bg-gradient-to-r from-accent-blue to-accent-yellow bg-clip-text text-transparent">
                {t('name')}
              </span>
            </motion.h1>

            {/* Animated Role Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xl md:text-2xl lg:text-3xl text-gray-800 dark:text-gray-200 mb-6 h-10 md:h-12 flex items-center justify-center md:justify-start"
            >
              <AnimatedText phrases={roles} />
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-8"
            >
              {t('description')}
            </motion.p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.a
            href="#content"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-accent-blue hover:text-accent-yellow transition-colors cursor-pointer"
            aria-label={t('scrollLabel')}
          >
            <ChevronDown size={32} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
