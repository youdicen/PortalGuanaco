const LIMIT_KEY = 'pgg_daily_queries';
const MAX_DAILY = 10;

interface QueryRecord {
  date: string;   // 'YYYY-MM-DD'
  count: number;
}

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getQueryRecord(): QueryRecord {
  try {
    const raw = localStorage.getItem(LIMIT_KEY);
    if (raw) {
      const rec: QueryRecord = JSON.parse(raw);
      if (rec.date === getTodayKey()) return rec;
    }
  } catch { /* ignore */ }
  return { date: getTodayKey(), count: 0 };
}

export function incrementQueryCount(): number {
  const rec = getQueryRecord();
  rec.count += 1;
  localStorage.setItem(LIMIT_KEY, JSON.stringify(rec));
  return rec.count;
}

export function hasReachedLimit(): boolean {
  return getQueryRecord().count >= MAX_DAILY;
}

export function getRemainingQueries(): number {
  return Math.max(0, MAX_DAILY - getQueryRecord().count);
}

export { MAX_DAILY };
