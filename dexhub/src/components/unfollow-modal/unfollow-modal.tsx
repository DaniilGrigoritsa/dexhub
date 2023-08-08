import { ReactComponent as CheckIcon } from '#src/assets/images/outline-check.svg';
import { getPnlValue } from '#src/lib';
import type { Trader } from '#src/types';
import { useAccount } from 'wagmi';

import type { ModalProps } from '../modal';
import { Modal } from '../modal';
import utils from '#src/scripts/utils';

type Props = Omit<ModalProps, 'children'> & Trader;

export const UnfollowModal = ({ show, avatar, name, lastName, pnl, onClose}: Props) => {

  const { address } = useAccount();

  const handleUnfollow = (trader: string, wallet: string | undefined) => {
    utils.removeTrader(trader, wallet);
  }

  return (
    <Modal show={show} onClose={onClose}>
      <CheckIcon color="#FF508D" width={56} height={56} />
      <span className="brand-subtitle">Unfollow this trader</span>
      <div className="trader-card-section">
        <div className="flex">
          <img className="push-sm-right" src={avatar} alt="avatar" />
          <div>
            <span className="brand-text-small brand-text-small--light">{name}</span>
            <br />
            <span className="brand-primary-text">{lastName}</span>
          </div>
        </div>
        <div className="flex align-end direction-column">
          <span className="brand-text-small">PnL-$</span>
          {getPnlValue(pnl, 'brand-price')}
        </div>
      </div>
      <div className="full-width">
        <button 
          className="btn btn--full-width btn--primary-red btn--small-padding"
          onClick={ () => { handleUnfollow(name, address) }}
        >
            Unfollow
        </button>
        <div className="push-xs-bottom" />
        <button 
          className="btn btn--full-width btn--small-padding color-text" 
          onClick={onClose}>
          Cancel
        </button>
      </div>
    </Modal>
  );
};
