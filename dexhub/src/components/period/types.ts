const PERIOD = ['day', 'week', 'month'] as const;

export type PeriodValues = (typeof PERIOD)[number];

export type PeriodOption<T = string> = { key: T; label: string }[];
