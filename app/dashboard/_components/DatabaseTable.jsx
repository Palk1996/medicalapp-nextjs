import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { Skeleton } from '@mui/material';
import {
    useReactTable,
    createColumnHelper,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnResizeDirection,
    ColumnResizeMode,
    ColumnDef
} from '@tanstack/react-table';

function DatabaseTable({ title, headers, fetchingPath, search }) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [dataFromSearch, setDataFromSearch] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const columnHelper = createColumnHelper();
    const [columnResizeMode, setColumnResizeMode] = useState('onChange')

    const [columnResizeDirection, setColumnResizeDirection] = useState('ltr')
    const columns = headers.map((name, index) => {
        return {
            ...columnHelper.accessor(name, {
                cell: (item) => <span>{String(item.getValue()).length > 20 ? String(item.getValue()).slice(0, 20) + '...' : String(item.getValue())}</span>,
                header: name,
                enableResizing: true,
                minSize: 50,
                maxSize: 500
            }),
        };
    });
    const table = useReactTable({
        data: dataFromSearch ? dataFromSearch : data,
        columns,
        state: {
            globalFilter
        },
        getFilteredRowModel: getFilteredRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        columnResizeMode,
        columnResizeDirection,
        debugTable: true,
        debugHeaders: true,
        debugColumns: true,
        initialState: {
            pagination: {
                pageSize: 8
            }
        }
    });

    useEffect(() => {
        const fetchData = () => {
            setTimeout(async () => {
                try {
                    const response = await fetch(fetchingPath);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const result = await response.json();
                    console.log(result);
                    setData(result);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }, 0);
            setTimeout(() => { setLoading(false); }, 3000);

        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = () => {
            setTimeout(async () => {
                try {
                    const response = await fetch(fetchingPath + `?search=${search}`);
                    const result = await response.json();
                    setDataFromSearch(result);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }, 0);
            setTimeout(() => { setLoading(false); }, 3000);

        };

        fetchData();
    }, [search]);

    useEffect(()=>{console.log(dataFromSearch)},[dataFromSearch])

    return (
        <div className='w-full flex flex-col items-center gap-4'>
            <table className="w-full" {...{
                style: {
                    width: table.getCenterTotalSize(),
                },
            }}>
                <thead>
                    {
                        table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {
                                    headerGroup.headers.map((header) => (
                                        <th {...{
                                            key: header.id,
                                            colSpan: header.colSpan,
                                            style: {
                                                width: header.getSize(),
                                            },
                                        }}
                                            className='p-2'
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            <div
                                                {...{
                                                    onDoubleClick: () => header.column.resetSize(),
                                                    onMouseDown: header.getResizeHandler(),
                                                    onTouchStart: header.getResizeHandler(),
                                                    className: `resizer ${table.options.columnResizeDirection
                                                        } ${header.column.getIsResizing() ? 'isResizing' : ''
                                                        }`,
                                                    style: {
                                                        transform:
                                                            columnResizeMode === 'onEnd' &&
                                                                header.column.getIsResizing()
                                                                ? `translateX(${(table.options.columnResizeDirection ===
                                                                    'rtl'
                                                                    ? -1
                                                                    : 1) *
                                                                (table.getState().columnSizingInfo
                                                                    .deltaOffset ?? 0)
                                                                }px)`
                                                                : '',
                                                    },
                                                }}
                                            />
                                        </th>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </thead>
                <tbody>
                    {!loading ? (
                        table.getRowModel().rows.map((row, i) => (
                            <tr key={row.id} className={`${i % 2 === 0 ? 'bg-[#fff]' : 'bg-slate-100'} text-sm`}>
                                {row.getVisibleCells().map(cell => (
                                    <td
                                        {...{
                                            key: cell.id,
                                            style: {
                                                width: cell.column.getSize(),
                                            },
                                        }}
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        table.getRowModel().rows.map((row, i) => (
                            <tr
                                key={row.id}
                                className={`${i % 2 === 0 ? "bg-[#fff]" : "bg-slate-100"}`}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="p-2 text-sm">
                                        <Skeleton animation="wave" height={25} />
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                    {!loading && table.getRowModel().rows.length === 0 &&
                        <tr className="text-center h-32">
                            <td colSpan={12}>No Recoard Found!</td>
                        </tr>
                    }
                </tbody>
            </table>
            <div className="flex items-center justify-end mt-2 gap-2">
                <button
                    onClick={() => {
                        table.previousPage();
                    }}
                    disabled={!table.getCanPreviousPage()}
                    className="p-1 border border-gray-300 px-2 disabled:opacity-30"
                >
                    {"<"}
                </button>
                <button
                    onClick={() => {
                        table.nextPage();
                    }}
                    disabled={!table.getCanNextPage()}
                    className="p-1 border border-gray-300 px-2 disabled:opacity-30"
                >
                    {">"}
                </button>

                <span className="flex items-center gap-1">
                    <div>Page</div>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount()}
                    </strong>
                </span>
                <span className="flex items-center gap-1">
                    | Go to page:
                    <input
                        type="number"
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={(e) => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0;
                            table.setPageIndex(page);
                        }}
                        className="border p-1 rounded w-16 bg-transparent"
                    />
                </span>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                        table.setPageSize(Number(e.target.value));
                    }}
                    className="p-2 bg-transparent"
                >
                    {[4, 8, 12, 16].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default DatabaseTable;
