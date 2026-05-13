'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ContentCardProps {
  type: 'video' | 'podcast' | 'blog';
  title: string;
  description: string;
  image?: string;
  url: string;
  date?: string;
}

export default function ContentCard({
  type,
  title,
  description,
  image,
  url,
  date,
}: ContentCardProps) {
  const t = useTranslations('home.latestContent');

  const typeConfig = {
    video: {
      label: t('video'),
      bgGradient: 'from-red-500/20 to-red-900/20',
      borderColor: 'border-red-500/30',
      iconColor: 'text-red-400',
    },
    podcast: {
      label: t('podcast'),
      bgGradient: 'from-green-500/20 to-green-900/20',
      borderColor: 'border-green-500/30',
      iconColor: 'text-green-400',
    },
    blog: {
      label: t('blog'),
      bgGradient: 'from-blue-500/20 to-blue-900/20',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-400',
    },
  };

  const config = typeConfig[type];

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.3 }}
      className={`block group relative overflow-hidden rounded-xl border ${config.borderColor} bg-gradient-to-br ${config.bgGradient} backdrop-blur-sm p-6 hover:shadow-2xl transition-all duration-300`}
    >
      {/* Type Label */}
      <div className="flex items-center justify-between mb-4">
        <span className={`text-sm font-semibold ${config.iconColor}`}>
          {config.label}
        </span>
        <ExternalLink
          size={18}
          className={`${config.iconColor} opacity-0 group-hover:opacity-100 transition-opacity`}
        />
      </div>

      {/* Image */}
      {image && (
        <div className="mb-4 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 h-48">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      )}

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-accent-blue transition-colors">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-3">{description}</p>

      {/* Date */}
      {date && <p className="text-xs text-gray-500 dark:text-gray-500">{date}</p>}
    </motion.a>
  );
}
