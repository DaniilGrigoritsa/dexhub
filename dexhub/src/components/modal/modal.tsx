import { PropsWithChildren, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useEventListener } from 'usehooks-ts';
import classNames from 'classnames';
import { ReactComponent as CloseIcon } from '#src/assets/images/close.svg';

export type Props = PropsWithChildren<{ show: boolean; className?: string; onClose: () => void }>;

export const Modal = ({ show, className, children, onClose }: Props) => {
  const container = useMemo(() => document.createElement('div'), []);

  useEventListener('keydown', (event: KeyboardEvent) => {
    const { key } = event;
    if (show && key === 'Escape') {
      onClose();
    }
  });

  useEffect(() => {
    document.body.appendChild(container);
    return () => {
      document.body.removeChild(container);
    };
  }, [container]);

  useEffect(() => {
    if (show) {
      document.documentElement.style.overflowY = 'hidden';
    }
    else {
      document.documentElement.style.overflowY = 'auto';
    }
    return () => {
      document.documentElement.style.overflowY = 'auto';
    };
  }, [show, container]);

  return show
    ? createPortal(
        <div className="modal">
          <button className="modal__close" onClick={onClose} />
          <div className="modal-body">
            <div className="modal-body__inner">
              <div className={classNames('modal-content', className)}>
                <button className="modal-content__close" onClick={onClose}>
                  <CloseIcon width={24} height={24} />
                </button>
                {children}
              </div>
            </div>
          </div>
        </div>,
        container,
      )
    : null;
};
