import { ReactComponent as ArbitrumIcon } from '#src/assets/images/arbitrum.svg';
import { ReactComponent as AvalancheIcon } from '#src/assets/images/avalanche.svg';
import { ReactComponent as BrandIcon } from '#src/assets/images/logo.svg';

import main from '#src/scripts/main';

export const Sidebar = () => {
  const handleChainButtonClick = async (chainId: string) => {
    await main.requestChangeNetwork(chainId);
  };

  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        <BrandIcon width={36} height={36} />
      </div>
      <ul className="sidebar-menu">
        <li>
          <button className="sidebar__button" onClick={() => handleChainButtonClick('42161')}>
            <ArbitrumIcon width={48} height={48} />
          </button>
        </li>
        <li>
          <button className="sidebar__button" onClick={() => handleChainButtonClick('43114')}>
            <AvalancheIcon width={48} height={48} />
          </button>
        </li>
      </ul>
    </div>
  );
};
