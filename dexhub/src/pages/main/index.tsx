import { Layout, Period, SortButton } from '#src/components';
// import { TRADER_LIST } from '#src/config';
import { useBoolean } from 'usehooks-ts';
import { AutoFollowingModal, Card } from './components';
import { useAccount } from 'wagmi';
import main from '#src/scripts/main';
import { useState, useEffect } from 'react';
import { zeroAddress } from "viem";
import utils from "#src/scripts/utils";
import database from "#src/scripts/database";
import { Trader } from '#src/types';

export const Main = () => {
  const { value, setTrue, setFalse } = useBoolean(false);

  const { address } = useAccount();

  const [showCreateAccButton, setShowCreateAccButton] = useState(true);
  const [trader, setTrader] = useState<string>("");
  const [traderList, setTraderList] = useState<Trader[]>([]);

  useEffect(() => {
    const getList = async () => {
      const list: Trader[] = await utils.getTraderList(address);
      console.log("list", list)
      if (list.length > 0) {
        setTraderList(list);
      }
      console.log("LIST", traderList)
    }
    getList();
  }, []);

  useEffect(() => {
    const userHasAccount = async () => {
      const hasAccount = await utils.getUserAccount(address);
      if (hasAccount == zeroAddress) setShowCreateAccButton(true);
      else setShowCreateAccButton(false);
    }
    database.initDataBase();
    userHasAccount();
  }, [])

  const handleInputChange = (event: any) => {
    setTrader(event.target.value);
  };

  return (
    <Layout>
      {
        showCreateAccButton ? 
        <div className="main-page__create-acc">
          <div>
            <h1 className="brand-headline">Create account user</h1>
            <span className="brand-description">
              In order to start auto-following a trader, you need to create an account in your wallet
            </span>
          </div>
          <button onClick={() => main.createUserAccount(address)} className="btn btn--primary main-page__button">Create User Account</button>
        </div> : null 
      }
      <h1 className="brand-headline">Select trader</h1>
      <span className="brand-description">Insert trader address from GMX.io or select from the list</span>
      <div className="main-page-actions">
        <div className="flex">
          <div className="main-page-search">
            <input type="text" value={trader} onChange={handleInputChange} className="text-input text-input--full-width" placeholder="Paste trader address" />
            <button className="main-page-search__button">Paste</button>
          </div>
          <button onClick={() => { utils.addTrader(trader, address); setTrue }} className="btn btn--primary main-page__button" >
            Follow
          </button>
        </div>
        <div className="main-page-actions__sort">
          <SortButton>PnL-$</SortButton>
          <SortButton>Size</SortButton>
          <Period />
        </div>
      </div>
      <div className="main-page-content">
        {traderList.map((obj, index) => (
          <Card key={obj.name + index} {...obj} />
        ))}
      </div>
      <AutoFollowingModal show={value} onClose={setFalse} />
    </Layout>
  );
};
