'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Calendar, MonitorPlay, Presentation, X, ZoomIn } from 'lucide-react';
import { useTranslations } from 'next-intl';
import timelineData from '@/data/timeline.json';

interface TimelineItem {
  title: string;
  event_context: string;
  date: string;
  display_date: string;
  media: {
    thumbnail_url: string;
    zoom_url: string;
  };
  links: {
    presentation: string | null;
    video: string | null;
  };
  tags: string[];
  description: string;
}

export default function Timeline() {
  const t = useTranslations('contributions');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    timelineData.forEach((item: TimelineItem) => {
      item.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  // Filter items based on selected tag
  const filteredData = useMemo(() => {
    if (!selectedTag) return timelineData as TimelineItem[];
    return (timelineData as TimelineItem[]).filter(item => item.tags.includes(selectedTag));
  }, [selectedTag]);

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Tag Cloud Filter */}
      <div className="mb-16">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 text-center">
          {t('filterByTopic')}
        </h3>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedTag === null
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {t('all')}
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedTag === tag
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Central Axis for Desktop */}
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-blue-100 dark:bg-blue-900/30"></div>
        {/* Left Axis for Mobile */}
        <div className="md:hidden absolute left-4 w-0.5 h-full bg-blue-100 dark:bg-blue-900/30"></div>

        <div className="space-y-12 md:space-y-24">
          <AnimatePresence mode="popLayout">
            {filteredData.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, type: 'spring', bounce: 0.3 }}
                  key={`${item.title}-${item.date}`}
                  className={`relative flex flex-col md:flex-row items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-blue-600 border-4 border-white dark:border-[#0b0f19] z-10 hidden md:block"></div>
                  <div className="absolute left-4 transform -translate-x-1/2 w-4 h-4 rounded-full bg-blue-600 border-4 border-white dark:border-[#0b0f19] z-10 md:hidden mt-6"></div>

                  {/* Content Card */}
                  <div className={`w-full pl-12 md:pl-0 md:w-1/2 ${isEven ? 'md:pr-16' : 'md:pl-16'}`}>
                    <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden hover:shadow-md transition-shadow group">
                      
                      {/* Media Area */}
                      <div 
                        className="relative h-48 sm:h-64 w-full cursor-pointer overflow-hidden bg-gray-100 dark:bg-gray-900"
                        onClick={() => setLightboxImage(item.media.zoom_url)}
                      >
                        <Image
                          src={item.media.thumbnail_url}
                          alt={item.title}
                          fill
                          loading="lazy"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" size={32} />
                        </div>
                      </div>

                      {/* Text Content */}
                      <div className="p-6">
                        <div className="flex flex-wrap items-center gap-3 mb-3 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md">
                            <Calendar size={14} />
                            {item.display_date}
                          </span>
                          <span className="font-medium">{item.event_context}</span>
                        </div>
                        
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                          {item.title}
                        </h4>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">
                          {item.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {item.tags.map(tag => (
                            <span key={tag} className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full border border-gray-200 dark:border-gray-700">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Links */}
                        <div className="flex items-center gap-4 border-t border-gray-100 dark:border-gray-700/50 pt-4">
                          {item.links.presentation && (
                            <a 
                              href={item.links.presentation}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                            >
                              <Presentation size={16} />
                              {t('slides')}
                            </a>
                          )}
                          {item.links.video && (
                            <a 
                              href={item.links.video}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                            >
                              <MonitorPlay size={16} />
                              {t('video')}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-black/50 p-2 rounded-full"
              onClick={() => setLightboxImage(null)}
            >
              <X size={24} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl aspect-video rounded-lg overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <Image
                src={lightboxImage}
                alt="Enlarged view"
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
