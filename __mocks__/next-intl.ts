import esMessages from '../messages/es.json';
import type { ReactNode } from 'react';

type Messages = typeof esMessages;

function readMessage(path: string, messages: Messages = esMessages): string {
  return path.split('.').reduce<unknown>((current, segment) => {
    if (current && typeof current === 'object' && segment in current) {
      return (current as Record<string, unknown>)[segment];
    }

    return undefined;
  }, messages) as string | undefined || path;
}

export function useTranslations(namespace?: string) {
  return (key: string) => readMessage(namespace ? `${namespace}.${key}` : key);
}

export function useLocale() {
  return 'es';
}

export function NextIntlClientProvider({ children }: { children: ReactNode }) {
  return children;
}
