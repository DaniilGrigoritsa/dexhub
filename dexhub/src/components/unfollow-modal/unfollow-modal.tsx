import { ReactComponent as CheckIcon } from '#src/assets/images/outline-check.svg';
import { getPnlValue } from '#src/lib';
import type { Trader } from '#src/types';
import { useAccount } from 'wagmi';
import { PropsWithChildren } from 'react';
import { Modal } from '../modal';
import utils from '#src/scripts/utils';

// type PropsOmit = Omit<ModalProps, 'children'> & Trader;
type Props = PropsWithChildren<{
  show: boolean;
  onClose: () => void;
  trader: Trader;
  reload: number;
  setReload: (reload: number) => void;
}>;

export const UnfollowModal = (props: Props) => {
  const { address } = useAccount();

  const handleUnfollow = async (trader: string, wallet: string | undefined) => {
    await utils.removeTrader(trader, wallet);
  };

  return (
    <Modal show={props.show} className="modal-unfollow" onClose={props.onClose}>
      <CheckIcon color="#FF508D" width={56} height={56} />
      <span className="brand-subtitle">Unfollow this trader</span>
      <div className="trader-card-section">
        <div className="flex">
          <img className="push-sm-right" src={props.trader.avatar} alt="avatar" />
          <div>
            <span className="brand-text-small brand-text-small--light">{props.trader.name.substring(0, 5)}</span>
            <br />
            <span className="brand-primary-text">{props.trader.lastName}</span>
          </div>
        </div>
        <div className="flex align-end direction-column">
          <span className="brand-text-small">PnL-$</span>
          {getPnlValue(props.trader.pnl, 'brand-price')}
        </div>
      </div>
      <div className="full-width">
        <button
          className="btn btn--full-width btn--primary-red btn--small-padding"
          onClick={async () => {
            props.onClose();
            await handleUnfollow(props.trader.name, address);
            props.setReload(props.reload + 1);
          }}
        >
          Unfollow
        </button>
        <div className="push-xs-bottom" />
        <button className="btn btn--full-width btn--small-padding color-text" onClick={props.onClose}>
          Cancel
        </button>
      </div>
    </Modal>
  );
};
