import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

import { ReactComponent as WalletIcon } from '#src/assets/images/money-wallet.svg';
import { ReactComponent as ArrowIcon } from '#src/assets/images/small-down-outline.svg';
import { ROUTES } from '#src/config';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export const Header = () => {
  return (
    <div className="header">
      <nav>
        <ul className="header-menu">
          <li>
            <NavLink to={ROUTES.main.path}>
              {({ isActive }) => (
                <span className={classNames({ 'header-menu__link': true, 'header-menu__link--active': isActive })}>
                  Home
                </span>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to={ROUTES.main.followedList.path}>
              {({ isActive }) => (
                <span className={classNames({ 'header-menu__link': true, 'header-menu__link--active': isActive })}>
                  Followed list
                </span>
              )}
            </NavLink>
          </li>
        </ul>
      </nav>
      <ConnectButton.Custom>
        {({ account, chain, openAccountModal, openConnectModal, authenticationStatus, mounted }) => {
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated');

          return (
            <div>
              {(() => {
                if (!connected) {
                  return (
                    <button className="header__wallet" onClick={openConnectModal}>
                      <WalletIcon width={24} height={24} />
                      <span>Connect Wallet</span>
                    </button>
                  );
                }

                return (
                  <div className="flex">
                    <button className="btn" onClick={openAccountModal}>
                      {account.displayName}
                      <span className="push-sm-left" />
                      <ArrowIcon width={12} height={8} />
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
};
