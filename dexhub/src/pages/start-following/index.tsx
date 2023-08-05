import { Link } from 'react-router-dom';
import { useBoolean } from 'usehooks-ts';
import { ReactComponent as ArrowIcon } from '#src/assets/images/outline-arrow-left.svg';
import { ReactComponent as UsdsIcon } from '#src/assets/images/usdc.svg';
import { FollowModal, Layout, Period } from '#src/components';
import { TRADER_LIST } from '#src/config';
import { getPnlValue } from '#src/lib';

export const StartFollowing = () => {
  const { value, setTrue, setFalse } = useBoolean(false);
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
              <img className="push-sm-right" src={TRADER_LIST[0].avatar} alt="avatar" width={48} height={48} />
              <div>
                <span className="brand-text-small brand-text-small--light">{TRADER_LIST[0].name}</span>
                <br />
                <span className="brand-primary-text">{TRADER_LIST[0].lastName}</span>
              </div>
            </div>
            <div className="flex align-center direction-column ">
              <span className="brand-text-small">Win/Loss</span>
              <div className="push-sm-bottom" />
              <span>
                {TRADER_LIST[0].win} / {TRADER_LIST[0].loss}
              </span>
            </div>
            <div className="flex align-center direction-column">
              <span className="brand-text-small">Size</span>
              <span className="border-bottom">{TRADER_LIST[0].size.toLocaleString('ru')}</span>
              <span className="brand-text-small brand-text-small--light">8x</span>
            </div>
            <div className="flex align-end direction-column">
              <span className="brand-text-small">PnL-$</span>
              {getPnlValue(TRADER_LIST[0].pnl, 'brand-price')}
            </div>
          </div>
        </div>
        <div className="start-following-enter-form">
          <span className="start-following-enter-form__title">Enter the amount USDC</span>
          <span className="start-following-enter-form__title">auto-following the select trader's</span>
          <div className="usds-field push-ms-top">
            <input className="text-input text-input--full-width" placeholder="Approve USDC" />
            <UsdsIcon width={24} height={24} />
          </div>
          <button className="btn btn--primary full-width push-md-top" onClick={setTrue}>
            Start following
          </button>
        </div>
      </div>
      <FollowModal show={value} onClose={setFalse} />
    </Layout>
  );
};
