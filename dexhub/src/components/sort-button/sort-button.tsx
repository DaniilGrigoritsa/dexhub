import { ButtonHTMLAttributes, PropsWithChildren, forwardRef } from 'react';

import { ReactComponent as AscIcon } from '#src/assets/images/arrows-ask.svg';

type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export const SortButton = forwardRef<HTMLButtonElement, Props>(({ children }, ref) => {
  return (
    <button ref={ref} className="btn">
      {children}
      <span className="push-xs-left">
        <AscIcon />
      </span>
    </button>
  );
});
