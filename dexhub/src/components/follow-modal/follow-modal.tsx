import { ReactComponent as CheckIcon } from '#src/assets/images/outline-check.svg';

import type { ModalProps } from '../modal';
import { Modal } from '../modal';

type Props = Omit<ModalProps, 'children'>;

export const FollowModal = ({ show, onClose }: Props) => (
  <Modal show={show} onClose={onClose}>
    <CheckIcon width={56} height={56} color="#9D50FF" />
    <span className="brand-subtitle">Unfollow this trader</span>
    <span className="brand-description">
      Auto-following tracking of the trader <br /> has begun.
    </span>
    <div className="full-width">
      <button 
        className="btn btn--full-width btn--primary btn--small-padding"
        onClick={onClose}
      >
        Ok
      </button>
      <div className="push-xs-bottom" />
      <button 
        className="btn btn--full-width btn--small-padding color-text" 
        onClick={onClose}
      >
        Start new following
      </button>
    </div>
  </Modal>
);
