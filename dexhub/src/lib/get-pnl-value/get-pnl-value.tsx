import classNames from 'classnames';

export const getPnlValue = (value: number, className?: string) =>
  !value ? (
    <span className="brand-price">0</span>
  ) : (
    <span className={classNames(className, `brand-price${value < 0 ? '--negative' : '--positive'}`)}>
      {value.toLocaleString('ru', {
        signDisplay: 'always',
      })}
    </span>
  );
