import { Layout, Period, SortButton } from '#src/components';
import { useBoolean } from 'usehooks-ts';
import { AutoFollowingModal, Card } from './components';
import { useAccount } from 'wagmi';
import main from '#src/scripts/main';
import { useState, useEffect } from 'react';
import { zeroAddress } from 'viem';
import utils from '#src/scripts/utils';
import database from '#src/scripts/database';
import { Trader } from '#src/types';
import { PropsWithChildren } from 'react';
import { PeriodValues } from '#src/components/period/types';

type MainProps = PropsWithChildren<{ trader: Trader | null; setTrader: (trader: Trader) => void }>;

export const Main = (props: MainProps) => {
  const { value, setTrue, setFalse } = useBoolean(false);

  const { address } = useAccount();

  const [showCreateAccButton, setShowCreateAccButton] = useState<boolean>(true);
  const [traderAddress, setTraderAddress] = useState<string>('');
  const [traderList, setTraderList] = useState<Trader[]>([]);
  const [sortBy, setSortBy] = useState<string>('realisedPnl');
  const [reload, setReload] = useState<number>(0);
  const [period, setPeriod] = useState<PeriodValues>('month');

  const handleTraderChange = (_trader: Trader) => {
    props.setTrader(_trader);
  };

  useEffect(() => {
    const getList = async () => {
      const list: Trader[] = await utils.getTraderList(address, sortBy, period);
      if (list.length > 0) {
        setTraderList(list);
      }
    };
    getList();
  }, [sortBy, address, reload, period]);

  useEffect(() => {
    const userHasAccount = async () => {
      const hasAccount = await utils.getUserAccount(address);
      if (hasAccount == zeroAddress) setShowCreateAccButton(true);
      else setShowCreateAccButton(false);
    };
    database.initDataBase();
    userHasAccount();
  }, [address]);

  const handleInputChange = (event: any) => {
    setTraderAddress(event.target.value);
  };

  return (
    <Layout>
      {showCreateAccButton ? (
        <div className="main-page__create-acc">
          <div>
            <h1 className="brand-headline">Create account user</h1>
            <span className="brand-description">
              In order to start auto-following a trader, you need to create an account in your wallet
            </span>
          </div>
          <button onClick={() => main.createUserAccount(address)} className="btn btn--primary main-page__button">
            Create User Account
          </button>
        </div>
      ) : null}
      <h1 className="brand-headline">Select trader</h1>
      <span className="brand-description">Insert trader address from GMX.io or select from the list</span>
      <div className="main-page-actions">
        <div className="flex">
          <div className="main-page-search">
            <input
              type="text"
              value={traderAddress}
              onChange={handleInputChange}
              className="text-input text-input--full-width"
              placeholder="Paste trader address"
            />
            <button className="main-page-search__button">Paste</button>
          </div>
          <button
            onClick={() => {
              utils.addTrader(traderAddress, address);
              setTrue;
            }}
            className="btn btn--primary main-page__button"
          >
            Follow
          </button>
        </div>
        <div className="main-page-actions__sort">
          <SortButton onClick={() => setSortBy('realisedPnl')}>PnL-$</SortButton>
          <Period value={period} onChange={setPeriod} />
        </div>
      </div>
      <div className="main-page-content">
        {traderList.map((obj, index) => (
          <div onClick={() => handleTraderChange(obj)}>
            <Card
              key={obj.name + index}
              trader={obj}
              handleTraderChange={handleTraderChange}
              reload={reload}
              setReload={setReload}
            />
          </div>
        ))}
      </div>
      {!!props.trader && <AutoFollowingModal show={value} onClose={setFalse} trader={props.trader} />}
    </Layout>
  );
};
