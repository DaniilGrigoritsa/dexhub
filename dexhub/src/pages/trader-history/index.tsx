import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import classNames from 'classnames';
import { useAccount } from 'wagmi';

import { ReactComponent as AskIcon } from '#src/assets/images/arrows-ask.svg';
import { ReactComponent as DescIcon } from '#src/assets/images/arrows-desc.svg';
import { ReactComponent as ArrowIcon } from '#src/assets/images/outline-arrow-left.svg';
import { ReactComponent as Bull } from '#src/assets/images/bull.svg';
import { ReactComponent as Bear } from '#src/assets/images/bear.svg';
import { Layout, Period } from '#src/components';
import { AccountInfo } from '#src/components/account-info';
import { ROUTES } from '#src/config';
import { getPnlValue } from '#src/lib';
import type { TraderHistory as TraderHistoryType } from '#src/types';
import { Trader } from '#src/types';
import { useBoolean } from 'usehooks-ts';
import { FollowModal } from '#src/components';
import { UnfollowModal } from '#src/components';
import utils from '#src/scripts/utils';
import { Tokens } from '#src/config';
import { networks } from '#src/scripts/networks';
import { PeriodValues } from '#src/components/period/types';


export const TraderHistory = (trader: Trader) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [traderHistory, setTraderHistory] = useState<TraderHistoryType[]>([]);
  const [reload, setReload] = useState<number>(0);
  const [followed, setFollowed] = useState<'followed' | 'unfollowed' | null>(null);
  const [period, setPeriod] = useState<PeriodValues>("month");

  const { value, setFalse, setTrue } = useBoolean(false);

  const { address } = useAccount();

  useEffect(() => {
    const getHistory = async () => {
      const history = await utils.getTradersTradesHistory(trader.name, period);
      const isFollowed: Trader[] = await utils.getFollowedTraderInfo([trader.name], address);
      setFollowed(isFollowed[0].status);
      setTraderHistory(history);
    }
    getHistory();
  }, [reload, period]);

  const handleUnfollow = async () => {
    await utils.removeTrader(trader.name, address);
  }

  const handleStartFollowing = async () => {
    await utils.addTrader(trader.name, address);
  }

  const getChainId = (): number => {
    return parseInt(window.ethereum.chainId, 16);
  }

  const getTokenImage = (address: string): JSX.Element | null => {
    const Image = Tokens[getChainId()][address];
    if (Image) return <Image />;
    else return null;
  }

  const handleEtherscan = async () => {
    const url = `${networks[getChainId()]["screner"]}${trader.name}`;
    window.open(url);
  }

  const getLeverage = (sizedelta: number | string, collateralDelta: number): number => {
    const divisor = utils.adjustNumber(sizedelta) / utils.adjustNumber(collateralDelta);
    return Number(divisor.toFixed());
  }

  const columns: ColumnDef<TraderHistoryType, string | number>[] = useMemo(() => {
    const result: ColumnDef<TraderHistoryType, string | number>[] = [
      {
        header: () => <div className="flex justify-content-start full-width">Settled</div>,
        accessorKey: 'timestamp',
        cell: (info) => {
          const date = new Date(Number(info.getValue()) * 1000);
          const now = new Date();
          const day = date.getUTCDate();
          const month = date.getUTCMonth() + 1;
          const year = date.getUTCFullYear();
          return (
            <div className="flex direction-column align-start brand-text-small--light">
              <span>{-((now.getTime() - date.getTime()) / 3600000 / 24).toFixed(0)} days</span>
              <span>ago {`${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`}</span>
            </div>
          );
        },
      },
      {
        header: 'Entry',
        accessorKey: 'collateralDelta',
        cell: (info) => (
          <div className="flex direction-column align-center">
             <div className="trader-history-entry">
              { info.row.original.isLong ? <Bull /> : <Bear /> } 
              { getTokenImage(info.row.original.indexToken) }
             </div>
            <span className="brand-text-small">
              {utils.adjustNumber(info.getValue()).toLocaleString('ru', {
                signDisplay: 'always',
              })}
            </span>
          </div>
        ),
      },
      {
        header: 'Size',
        accessorKey: 'sizeDelta',
        cell: (info) => (
          <div className="flex align-center direction-column">
            <span className="border-bottom">{utils.adjustNumber(info.getValue()).toLocaleString('ru')}</span>
            <span className="brand-text-small--light">{getLeverage(info.getValue(), info.row.original.collateralDelta)}x</span>
          </div>
        ),
      },
      {
        header: 'PnL-$',
        accessorKey: 'realisedPnl',
        cell: (info) => getPnlValue(+utils.adjustNumber(info.getValue()), 'font-bold'),
      },
    ];

    result.push({
      header: 'Status',
      accessorKey: 'status',
      cell: (info) => {
        const value = info.getValue();

        return (
          <button
            className={classNames('btn', 'btn-status', {
              'btn-status--cancel': value === 'canceled',
              'btn-status--done': value === 'done',
            })}
            onClick={() => handleEtherscan()}
          >
            {value}
          </button>
        );
      },
    });

    return result;
  }, []);

  const table = useReactTable<TraderHistoryType>({
    data: traderHistory,
    columns,
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
  });

  return (
    <Layout>
      <div className="flex justify-space-between align-center push-2xl-bottom">
        <div className="trader-history-info">
          <Link className="btn" to={ROUTES.main.path}>
            <ArrowIcon width={24} height={24} />
          </Link>
          <AccountInfo name={trader.lastName} lastName={trader.lastName} avatar={trader.avatar} />
          {followed === 'unfollowed' ? (
            <button 
              className={classNames('btn', 'btn--secondary-red')}
              onClick={() => { setTrue(); handleUnfollow() }}
            >
              Unfollow
            </button>
          ) : (
            <button 
              className={classNames('btn', 'btn--secondary')}
              onClick={() => { setTrue(); handleStartFollowing() }}
            >
              Follow
            </button>
          )}
        </div>
        <Period value={period} onChange={setPeriod}/>
      </div>
      <div className="trader-history-table">
        <table className="table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: 'table-header__cell',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <AskIcon />,
                            desc: <DescIcon />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table
              .getRowModel()
              .rows.slice(0, traderHistory.length)
              .map((row) => {
                return (
                  <tr key={row.id} className="table__row">
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td key={cell.id} className="table-cell">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      {
        trader.status === 'unfollowed' ? 
        <UnfollowModal show={value} onClose={setFalse} trader={trader} reload={reload} setReload={setReload}/> : 
        <FollowModal show={value} onClose={setFalse} />
      }
    </Layout>
  );
};
