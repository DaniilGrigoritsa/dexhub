import { useBoolean } from 'usehooks-ts';

import { ReactComponent as ArbitrumIcon } from '#src/assets/images/arbitrum.svg';
import { ReactComponent as AvalancheIcon } from '#src/assets/images/avalanche.svg';
import { ReactComponent as ExitIcon } from '#src/assets/images/exit-door.svg';
import { ReactComponent as BrandIcon } from '#src/assets/images/logo.svg';
import { ReactComponent as ExitPowerIcon } from '#src/assets/images/outline-exit.svg';
import { Modal } from '#src/components';
import main from "#src/scripts/main";

export const Sidebar = () => {
  const { value, setTrue, setFalse } = useBoolean(false);

  const handleChainButtonClick = async (chainId: string) => {
    await main.requestChangeNetwork(chainId);
  }

  const handleDisconnectWallet = async () => {
    await main.disconnectWallet();
  }

  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        <BrandIcon width={36} height={36} />
      </div>
      <ul className="sidebar-menu">
        <li>
          <button className="sidebar__button" onClick={() => handleChainButtonClick("42161")}>
            <ArbitrumIcon width={48} height={48} />
          </button>
        </li>
        <li>
          <button className="sidebar__button" onClick={() => handleChainButtonClick("43114")}>
            <AvalancheIcon width={48} height={48} />
          </button>
        </li>
      </ul>
      <div className="sidebar-exit">
        <button className="sidebar-exit__button" onClick={setTrue}>
          <ExitPowerIcon />
        </button>
      </div>
      <Modal show={value} onClose={setFalse}>
        <ExitIcon width={56} height={56} />
        <div className="flex direction-column align-center">
          <span className="brand-subtitle">Log out</span>
          <span className="brand-description">Are you sure you want to log out?</span>
        </div>
        <div className="full-width">
          <button 
            className="btn btn--full-width btn--primary-red btn--small-padding"
            onClick={() => {setFalse(); handleDisconnectWallet()}}
          >
            Log Out
          </button>
          <div className="push-xs-bottom" />
          <button className="btn btn--full-width btn--small-padding color-text" onClick={setFalse}>
            No, stay logged in
          </button>
        </div>
      </Modal>
    </div>
  );
};
