import { useEffect, useState } from 'react';
import classNames from 'classnames';

import type { PeriodValues } from './types';
import { TIMES_PERIOD } from './constants';

type Props = { value?: PeriodValues; onChange?: (value: PeriodValues) => void };

export const Period = ({ value, onChange }: Props) => {
  const [activeValue, setAvtiveValue] = useState<PeriodValues | null>(null);

  useEffect(() => {
    if (value) {
      setAvtiveValue((prevValue) => (prevValue === value ? null : value));
    }
  }, [value]);

  return (
    <div className="time-period">
      <span>Period:</span>
      {TIMES_PERIOD.map(({ key, label }) => (
        <button
          className={classNames('btn', { 'btn--active': key === activeValue })}
          key={key}
          onClick={() => onChange?.(key) || setAvtiveValue(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
