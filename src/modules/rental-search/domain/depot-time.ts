import { RentalError } from '@/modules/reservation/domain/validation';

/** Resolve a depot wall clock without depending on the browser/server timezone. */
export function depotDateTime(date: string, time: string, timeZone: string): string {
  const wall = `${date}T${time}:00`;
  let instant = Date.parse(`${wall}Z`);
  if (!Number.isFinite(instant)) throw new RentalError('invalid_search', 400);
  for (let index = 0; index < 3; index++) {
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone,
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(new Date(instant));
    const part = (type: string) => parts.find(p => p.type === type)!.value;
    const represented = Date.parse(`${part('year')}-${part('month')}-${part('day')}T${part('hour')}:${part('minute')}:00Z`);
    const delta = Date.parse(`${wall}Z`) - represented;
    if (!delta) return new Date(instant).toISOString();
    instant += delta;
  }
  throw new RentalError('invalid_search', 400); // nonexistent DST wall time
}
