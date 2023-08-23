import type { PeriodOption, PeriodValues } from './types';

export const TIMES_PERIOD: PeriodOption<PeriodValues> = [
  { key: 'day', label: '24Hour' },
  { key: 'week', label: '7Day' },
  { key: 'month', label: 'All Time' },
];
