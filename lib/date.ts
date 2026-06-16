/** Date parsing & formatting for the API's "MM/DD/YYYY HH:mm" local strings. */

export function parseGameDate(local: string): Date {
  const [date, time] = local.split(' ');
  const [mm, dd, yyyy] = date.split('/').map(Number);
  const [h, m] = (time ?? '00:00').split(':').map(Number);
  return new Date(yyyy, mm - 1, dd, h ?? 0, m ?? 0);
}

/** YYYY-MM-DD key (local) used to bucket matches by calendar day. */
export function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export function formatDayHeader(d: Date): string {
  return `${WEEKDAY[d.getDay()]} ${d.getDate()} ${MONTH[d.getMonth()]}`;
}

export function formatTime(d: Date): string {
  const h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hr = h % 12 || 12;
  return `${hr}:${String(m).padStart(2, '0')} ${ampm}`;
}
