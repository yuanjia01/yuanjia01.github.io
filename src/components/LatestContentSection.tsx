'use client';

import ContentCard from './ContentCard';
import { useTranslations, useLocale } from 'next-intl';

interface ContentData {
  videos: Array<{
    title: string;
    description: string;
    url: string;
    date: string;
    image: string;
  }>;
  podcast: {
    title: string;
    description: string;
    url: string;
    date: string;
    image: string;
  };
  blog: {
    title: string;
    description: string;
    url: string;
    date: string;
    image: string;
  };
}

interface LatestContentSectionProps {
  contentData: ContentData;
}

function formatDate(dateString: string, locale: string, t: any): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return t('home.dateFormats.today');
  if (diffDays === 1) return t('home.dateFormats.yesterday');
  if (diffDays < 7) return t('home.dateFormats.daysAgo', { days: diffDays });
  if (diffDays < 30) return t('home.dateFormats.weeksAgo', { weeks: Math.floor(diffDays / 7) });
  return t('home.dateFormats.monthsAgo', { months: Math.floor(diffDays / 30) });
}

export default function LatestContentSection({ contentData }: LatestContentSectionProps) {
  const t = useTranslations();
  const locale = useLocale();
  const { videos, podcast, blog } = contentData;

  return (
    <section id="content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-4">
        {t('home.latestContent.title')}{' '}
        <span className="text-accent-blue">{t('home.latestContent.titleHighlight')}</span>
      </h2>

      {/* Language note for English version */}
      {locale === 'en' && (
        <p className="text-center text-gray-600 dark:text-gray-400 text-sm mb-8 max-w-2xl mx-auto">
          {t('home.latestContent.note')}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
        {/* Video Cards - Show latest 2 videos */}
        {videos.map((video, index) => (
          <ContentCard
            key={`video-${index}`}
            type="video"
            title={video.title}
            description={video.description}
            url={video.url}
            date={formatDate(video.date, locale, t)}
            image={video.image}
          />
        ))}

        {/* Podcast Card */}
        <ContentCard
          type="podcast"
          title={podcast.title}
          description={podcast.description}
          url={podcast.url}
          date={formatDate(podcast.date, locale, t)}
          image={podcast.image}
        />

        {/* Blog Card */}
        <ContentCard
          type="blog"
          title={blog.title}
          description={blog.description}
          url={blog.url}
          date={formatDate(blog.date, locale, t)}
          image={blog.image}
        />
      </div>
    </section>
  );
}
