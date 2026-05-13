'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Detect browser language
    const browserLang = navigator.language.toLowerCase();
    const preferredLocale = browserLang.startsWith('es') ? 'es' : 'en';

    // Redirect to the preferred locale
    router.replace(`/${preferredLocale}`);
  }, [router]);

  // Show loading state
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0b0f19]">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
      </div>
    </div>
  );
}
