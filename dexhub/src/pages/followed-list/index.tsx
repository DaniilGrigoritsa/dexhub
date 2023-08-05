import { useMemo, useState } from 'react';
import { ReactComponent as AskIcon } from '#src/assets/images/arrows-ask.svg';
import { ReactComponent as DescIcon } from '#src/assets/images/arrows-desc.svg';
import { Layout, Period, UnfollowModal } from '#src/components';
import { TRADER_LIST } from '#src/config';
import { getPnlValue } from '#src/lib';
import type { Trader } from '#src/types';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import classNames from 'classnames';

export const FollowedList = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedTrader, setSelectedTrader] = useState<Trader | null>(null);

  const getColumns: ColumnDef<Trader, string | number>[] = useMemo(
    () => [
      {
        header: 'Account',
        accessorKey: 'name',
        cell: (info) => (
          <div className="flex align-center">
            <img className="push-sm-right" src={info.row.original.avatar} alt="avatar" width={48} height={48} />
            <div className="flex direction-column align-start">
              <span className="brand-text-small brand-text-small--light">{info.getValue()}</span>
              <span className="brand-primary-text">{info.row.original.lastName}</span>
            </div>
          </div>
        ),
      },
      {
        header: 'Win/Loss',
        accessorKey: 'win',
        cell: (info) => (
          <span>
            {info.getValue()}/{info.row.original.loss}
          </span>
        ),
      },
      {
        header: 'Size',
        accessorKey: 'size',
        cell: (info) => (
          <div className="flex align-center direction-column">
            <span className="border-bottom">{info.getValue().toLocaleString('ru')}</span>
            <span className="brand-text-small brand-text-small--light">8x</span>
          </div>
        ),
      },
      {
        header: 'PnL-$',
        accessorKey: 'pnl',
        cell: (info) => getPnlValue(+info.getValue(), 'font-bold'),
      },
      {
        header: 'Approve USDC',
        accessorKey: 'approve',
        cell: (info) => <span className="font-bold">{info.getValue()}</span>,
      },
      {
        header: '',
        accessorKey: 'status',
        cell: (info) => (
          <div className="table-cell-unfollow-button">
            <button
              onClick={() => setSelectedTrader(info.row.original)}
              className={classNames('btn', 'btn--full-width', 'btn--secondary-red')}
            >
              Unfollow
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  const table = useReactTable<Trader>({
    data: TRADER_LIST,
    columns: getColumns,
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
  });

  return (
    <Layout>
      {/* <h1 className="brand-headline">No followed trader 😔 </h1>
      <span className="brand-description">Select a trader for auto follow on the main page</span> */}
      <div className="flex justify-space-between align-center push-2xl-bottom">
        <h1 className="brand-headline">Followed list</h1>
        <Period />
      </div>
      <div>
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
              .rows.slice(0, TRADER_LIST.length)
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
      {!!selectedTrader && <UnfollowModal show onClose={() => setSelectedTrader(null)} {...selectedTrader} />}
    </Layout>
  );
};
