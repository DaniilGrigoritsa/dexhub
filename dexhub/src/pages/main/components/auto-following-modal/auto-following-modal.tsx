import { useBoolean } from 'usehooks-ts';
import { useState } from 'react';

import { ReactComponent as CheckIcon } from '#src/assets/images/outline-check.svg';
import { ReactComponent as UsdsIcon } from '#src/assets/images/usdc.svg';
import type { ModalProps } from '#src/components';
import { FollowModal, Modal } from '#src/components';
import { TRADER_LIST } from '#src/config';
import { getPnlValue } from '#src/lib';

// import utils from '#src/scripts/utils';
// import main from '#src/scripts/main';

type Props = ModalProps;

export const AutoFollowingModal = ({ show, onClose }: Props) => {
  const { value, setFalse, setTrue } = useBoolean(false);

  const [approveAmont, setApproveAmont] = useState<number>();

  const handleInputChange = (event: any) => {
    setApproveAmont(event.target.value);
  };

  const handleStartFollowing = async () => {

  }

  return (
    <Modal show={show} onClose={onClose} >
      <CheckIcon width={56} height={56} color="#9D50FF" />
      <span className="brand-subtitle">
        Enter the amount USDC for <br /> auto-following the select trader's
      </span>
      <div className="flex justify-space-between align-center">
        <div className="flex push-md-right">
          <img className="push-sm-right" src={TRADER_LIST[0].avatar} alt="avatar" width={48} height={48} />
          <div>
            <span className="brand-text-small brand-text-small--light">{TRADER_LIST[0].name}</span>
            <br />
            <span className="brand-primary-text">{TRADER_LIST[0].lastName}</span>
          </div>
        </div>
        <div className="flex align-end direction-column">
          <span className="brand-text-small">PnL-$</span>
          {getPnlValue(TRADER_LIST[0].pnl, 'brand-price')}
        </div>
      </div>
      <div className="usds-field">
        <input type="text" value={approveAmont} onChange={handleInputChange} className="text-input text-input--full-width color-text" placeholder="Approve USDC" />
        <UsdsIcon width={24} height={24} />
      </div>
      <div className="full-width">
        <button onClick={() => { handleStartFollowing(); setTrue }} className="btn btn--full-width btn--primary" >
          Start following
        </button>
        <div className="push-xs-bottom" />
        <button className="btn btn--full-width color-text" onClick={onClose}>
          Cancel
        </button>
      </div>
      <FollowModal show={value} onClose={setFalse} />
    </Modal>
  );
};
