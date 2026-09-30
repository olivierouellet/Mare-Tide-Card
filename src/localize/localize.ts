import * as en from './languages/en.json';
import * as es from './languages/es.json';
import * as es419 from './languages/es-419.json';
import * as fr from './languages/fr.json';
import * as nb from './languages/nb.json';
import * as nl from './languages/nl.json';
import type { HomeAssistant, Language } from '../types';

export type Lang = Exclude<Language, 'auto'>;

const languages: Record<Lang, Record<string, unknown>> = { en, fr, es, 'es-419': es419, nl, nb };

/** Locale used for numbers, times and weekday names. */
const LOCALES: Record<Lang, string> = {
  en: 'en-CA',
  fr: 'fr-CA',
  es: 'es-ES',
  'es-419': 'es-419',
  nl: 'nl-NL',
  nb: 'nb-NO',
};

/** The card's language: the `language` option, or Home Assistant's when "auto". */
export function resolveLanguage(option: Language | undefined, hass?: HomeAssistant): Lang {
  if (option && option !== 'auto' && option in languages) return option;
  const haLang = (hass?.locale?.language ?? hass?.language ?? 'en').toLowerCase();
  if (haLang === 'es-419') return 'es-419';
  const base = haLang.split('-')[0];
  // Nynorsk and plain "no" readers get Bokmål rather than English.
  if (base === 'nn' || base === 'no') return 'nb';
  return base in languages ? (base as Lang) : 'en';
}

export function intlLocale(lang: Lang): string {
  return LOCALES[lang];
}

function lookup(path: string, dictionary: Record<string, unknown>): string | undefined {
  const value = path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, dictionary);
  return typeof value === 'string' ? value : undefined;
}

/** Translate `key` (e.g. "card.now"), replacing {placeholders}; falls back to English, then the key. */
export function localize(key: string, lang: Lang, vars: Record<string, string> = {}): string {
  const text = lookup(key, languages[lang]) ?? lookup(key, languages.en) ?? key;
  return text.replace(/\{(\w+)\}/g, (match, name: string) => vars[name] ?? match);
}
