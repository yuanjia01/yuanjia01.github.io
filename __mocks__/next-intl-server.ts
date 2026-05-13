import esMessages from '../messages/es.json';

type Messages = typeof esMessages;

function readMessage(path: string, messages: Messages = esMessages): string {
  return path.split('.').reduce<unknown>((current, segment) => {
    if (current && typeof current === 'object' && segment in current) {
      return (current as Record<string, unknown>)[segment];
    }

    return undefined;
  }, messages) as string | undefined || path;
}

export async function getTranslations({
  namespace,
}: {
  locale?: string;
  namespace?: string;
} = {}) {
  return (key: string) => readMessage(namespace ? `${namespace}.${key}` : key);
}

export async function getMessages() {
  return esMessages;
}

export function unstable_setRequestLocale() {}
