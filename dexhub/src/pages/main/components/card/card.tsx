import { UnfollowModal } from '#src/components';
import { ROUTES } from '#src/config';
import { getPnlValue } from '#src/lib';
import type { Trader } from '#src/types';
import { PropsWithChildren } from 'react';

import classNames from 'classnames';
import { Link, generatePath } from 'react-router-dom';
import { useBoolean } from 'usehooks-ts';
import { useAccount } from 'wagmi';
import { AccountInfo } from '#src/components/account-info';

import utils from '#src/scripts/utils';

type CardProps = PropsWithChildren<{
  trader: Trader;
  handleTraderChange: (trader: Trader) => void;
  reload: number;
  setReload: (reload: number) => void;
}>;

export const Card = (props: CardProps) => {
  const { value, setFalse, setTrue } = useBoolean(false);

  const { avatar, name, lastName, pnl, win, loss, status } = props.trader;

  const { address } = useAccount();

  return (
    <div className="trader-card">
      <div className="trader-card-section">
        <div className="trader-card-account">
          <Link
            className="trader-card__link"
            to={generatePath(ROUTES.main.traderHistory.path, {
              id: name + lastName,
            })}
            onClick={() => props.handleTraderChange(props.trader)}
          >
            <AccountInfo name={lastName} lastName={lastName} avatar={avatar} />
          </Link>
        </div>
      </div>
      <div className="trader-card-section">
        <div className="flex align-center direction-column">
          <span className="brand-text-small">Win/Loss</span>
          <div className="push-sm-bottom" />
          <span>
            {win} / {loss}
          </span>
        </div>
        <div className="flex align-end direction-column">
          <span className="brand-text-small">PnL-$</span>
          {getPnlValue(pnl, 'brand-price')}
        </div>
        {/* <div className="flex align-center direction-column">
          <span className="brand-text-small">Size</span>
          <span className="border-bottom">{size.toLocaleString('ru')}</span>
          <span>{leverage}x</span>
        </div> */}
      </div>
      {status === 'followed' ? (
        <Link
          to={generatePath(ROUTES.main.startFollowing.path, { id: name + lastName })}
          className={classNames('btn', 'btn--full-width', 'btn--secondary')}
          onClick={() => props.handleTraderChange(props.trader)}
        >
          Follow
        </Link>
      ) : (
        <button
          className={classNames('btn', 'btn--full-width', 'btn--secondary-red')}
          onClick={() => {
            utils.removeTrader(name, address);
            setTrue();
          }}
        >
          Unfollow
        </button>
      )}
      <UnfollowModal
        show={value}
        onClose={setFalse}
        trader={props.trader}
        reload={props.reload}
        setReload={props.setReload}
      />
    </div>
  );
};
