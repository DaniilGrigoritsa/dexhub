import { Link } from 'react-router-dom';
import { useBoolean } from 'usehooks-ts';
import { ReactComponent as ArrowIcon } from '#src/assets/images/outline-arrow-left.svg';
import { ReactComponent as UsdsIcon } from '#src/assets/images/usdc.svg';
import { FollowModal, Layout, Period } from '#src/components';
import { getPnlValue } from '#src/lib';
import { Trader } from '#src/types';
import { useState } from 'react';
import main from '#src/scripts/main';
import { useAccount } from 'wagmi';
import utils from '#src/scripts/utils';

export const StartFollowing = (trader: Trader) => {
  const { value, setTrue, setFalse } = useBoolean(false);
  const { address } = useAccount();

  const [approveAmount, setApproveAmount] = useState<number>();

  const handleInputChange = (event: any) => {
    setApproveAmount(event.target.value);
  };

  const handleApprove = async () => {
    if (approveAmount) await main.approve(approveAmount, address);
    utils.addTrader(trader.name, address);
  }

  return (
    <Layout>
      <div className="push-md-bottom">
        <Link className="btn" to="..">
          <ArrowIcon width={24} height={24} />
          <span className="brand-description push-sm-left">Back</span>
        </Link>
      </div>
      <h1 className="brand-headline">Approve USDC</h1>
      <span className="brand-description">Enter the amount for auto-following the trader's trades</span>
      <div className="flex">
        <div>
          <div className="start-following-header">
            <span>Select trader</span>
            <Period />
          </div>
          <div className="start-following-content">
            <div className="flex">
              <img className="push-sm-right" src={trader.avatar} alt="avatar" width={48} height={48} />
              <div>
                <span className="brand-text-small brand-text-small--light">{trader.lastName}</span>
                <br />
                <span className="brand-primary-text">{trader.lastName}</span>
              </div>
            </div>
            <div className="flex align-center direction-column ">
              <span className="brand-text-small">Win/Loss</span>
              <div className="push-sm-bottom" />
              <span>
                {trader.win} / {trader.loss}
              </span>
            </div>
            <div className="flex align-center direction-column">
              <span className="brand-text-small">Size</span>
              <span className="border-bottom">{trader.size.toLocaleString('ru')}</span>
              <span className="brand-text-small brand-text-small--light">8x</span>
            </div>
            <div className="flex align-end direction-column">
              <span className="brand-text-small">PnL-$</span>
              {getPnlValue(trader.pnl, 'brand-price')}
            </div>
          </div>
        </div>
        <div className="start-following-enter-form">
          <span className="start-following-enter-form__title">Enter the amount USDC</span>
          <span className="start-following-enter-form__title">auto-following the select trader's</span>
          <div className="usds-field push-ms-top">
            <input type="text" value={approveAmount} onChange={handleInputChange} className="text-input text-input--full-width" placeholder="Approve USDC" />
            <UsdsIcon width={24} height={24} />
          </div>
          <button 
            className="btn btn--primary full-width push-md-top" 
            onClick={async () => { setTrue(); await handleApprove() }}
          >
            Start following
          </button>
        </div>
      </div>
      <FollowModal show={value} onClose={setFalse} />
    </Layout>
  );
};
