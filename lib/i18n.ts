import type { Stadium, Team } from './types';

export type Lang = 'en' | 'fa';

// The API ships English + Persian (Farsi) names for teams and stadiums.
// These helpers pick the right field and fall back to English when a Farsi
// value is missing.

export function teamName(team: Team | undefined, lang: Lang): string | undefined {
  if (!team) return undefined;
  return lang === 'fa' ? team.name_fa || team.name_en : team.name_en;
}

export function stadiumName(s: Stadium, lang: Lang): string {
  return lang === 'fa' ? s.name_fa || s.name_en : s.name_en;
}

export function stadiumCity(s: Stadium, lang: Lang): string {
  return lang === 'fa' ? s.city_fa || s.city_en : s.city_en;
}

export function stadiumCountry(s: Stadium, lang: Lang): string {
  return lang === 'fa' ? s.country_fa || s.country_en : s.country_en;
}

// A couple of UI strings that change with language.
export function t(key: 'venues' | 'capacity' | 'matches' | 'host', lang: Lang): string {
  const dict = {
    venues: { en: '16 venues · USA · Mexico · Canada', fa: '۱۶ ورزشگاه · آمریکا · مکزیک · کانادا' },
    capacity: { en: 'Capacity', fa: 'ظرفیت' },
    matches: { en: 'Matches here', fa: 'بازی‌ها' },
    host: { en: 'Host city', fa: 'شهر میزبان' },
  } as const;
  return dict[key][lang];
}
