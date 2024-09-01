import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  ColumnDef,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  OnChangeFn,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

type UseDataTableProps<TData> = {
  data?: TData[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[];
  rowCount?: number;
  count?: number;
  pageSize?: number;
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean);
  rowSelection?: {
    state: RowSelectionState;
    updater: OnChangeFn<RowSelectionState>;
  };
  enablePagination?: boolean;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enableExpandableRows?: boolean;
  getRowId?: (original: TData, index: number) => string;
  getSubRows?: (original: TData) => TData[];
};

const DEFAULT_PAGE_SIZE = 10;

export const useDataTable = <TData,>({
  data = [],
  columns,
  rowCount = 0,
  pageSize: _pageSize = DEFAULT_PAGE_SIZE,
  enablePagination = true,
  enableFiltering = true,
  enableSorting = true,
  enableRowSelection = false,
  enableExpandableRows = false,
  rowSelection: _rowSelection,
  getSubRows,
  getRowId,
}: UseDataTableProps<TData>) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const offsetKey = 'offset';
  const offset = searchParams.get(offsetKey);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: enablePagination ? (offset ? Math.ceil(Number(offset) / _pageSize) : 0) : 0,
    pageSize: enablePagination ? _pageSize : data.length,
  });
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );
  const [localRowSelection, setLocalRowSelection] = useState({});
  const rowSelection = _rowSelection?.state ?? localRowSelection;
  const setRowSelection = _rowSelection?.updater ?? setLocalRowSelection;

  const onPaginationChange = (updater: (old: PaginationState) => PaginationState) => {
    if (!enablePagination) return { pageIndex: 0, pageSize: data.length };

    const state = updater(pagination);
    const { pageIndex, pageSize } = state;

    setSearchParams((prev) => {
      if (!pageIndex) {
        prev.delete(offsetKey);
        return prev;
      }

      const newSearch = new URLSearchParams(prev);
      newSearch.set(offsetKey, String(pageIndex * pageSize));

      return newSearch;
    });

    setPagination(state);
    return state;
  };

  const onSortChange = (updater: (old: SortingState) => SortingState) => {
    const state = updater(sorting);

    setSearchParams((prev) => {
      if (!state.length) {
        prev.delete('sortBy');
        return prev;
      }

      const newSearch = new URLSearchParams(prev);
      newSearch.set('sortBy', state.map((sort) => `${sort.id}:${sort.desc ? 'desc' : 'asc'}`).join(','));

      return newSearch;
    });

    setSorting(state);
    return state;
  };

  return useReactTable({
    data,
    columns,
    state: {
      rowSelection: rowSelection, // We always pass a selection state to the table even if it's not enabled
      pagination: enablePagination ? pagination : { pageIndex: 0, pageSize: data.length },
      sorting: enableSorting ? sorting : undefined,
    },
    rowCount,
    enableRowSelection,
    getRowId,
    getSubRows,
    onRowSelectionChange: enableRowSelection ? setRowSelection : undefined,
    onPaginationChange: enablePagination ? (onPaginationChange as OnChangeFn<PaginationState>) : undefined,
    onSortingChange: enableSorting ? (onSortChange as OnChangeFn<SortingState>) : undefined,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    getExpandedRowModel: enableExpandableRows ? getExpandedRowModel() : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    manualPagination: enablePagination ? true : undefined,
    manualFiltering: enableFiltering ? true : undefined,
    manualSorting: enableSorting ? true : undefined,
  });
};
