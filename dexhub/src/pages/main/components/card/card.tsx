import { UnfollowModal } from '#src/components';
import { ROUTES } from '#src/config';
import { getPnlValue } from '#src/lib';
import type { Trader } from '#src/types';

import classNames from 'classnames';
import { Link, generatePath } from 'react-router-dom';
import { useBoolean } from 'usehooks-ts';
import { useAccount } from 'wagmi';

import utils from '#src/scripts/utils';

type Props = Trader;

export const Card = (props: Props) => {
  const { value, setFalse, setTrue } = useBoolean(false);
  
  const { avatar, name, lastName, pnl, win, loss, size, leverage, status } = props;

  const { address } = useAccount();

  return (
    <div className="trader-card">
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
      <div className="trader-card-section">
        <div className="flex align-center direction-column ">
          <span className="brand-text-small">Win/Loss</span>
          <div className="push-sm-bottom" />
          <span>
            {win} / {loss}
          </span>
        </div>
        <div className="flex align-center direction-column">
          <span className="brand-text-small">Size</span>
          <span className="border-bottom">{size.toLocaleString('ru')}</span>
          <span>{leverage}x</span>
        </div>
      </div>
      {status === 'followed' ? (
        <Link
          to={generatePath(ROUTES.main.startFollowing.path, { id: name + lastName })}
          className={classNames('btn', 'btn--full-width', 'btn--secondary')}
        >
          Follow
        </Link>
      ) : (
        <button 
          className={classNames('btn', 'btn--full-width', 'btn--secondary-red')} 
          onClick={() => { utils.removeTrader(name, address); setTrue }}
        >
          Unfollow
        </button>
      )}
      <UnfollowModal show={value} onClose={setFalse} {...props} />
    </div>
  );
};
