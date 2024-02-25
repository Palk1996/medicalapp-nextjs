import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { Skeleton } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import { onSweetAlert, onSweetAsking } from '@/app/libs/notifications';
import Button from '@mui/material/Button'
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import Swal from 'sweetalert2';
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
import dynamic from 'next/dynamic';
import { Bold } from '@tremor/react';
const QuillEditor = dynamic(() => import('react-quill'), { ssr: false });

function IndeterminateCheckbox({ indeterminate, className = '', ...rest }) {
    const ref = React.useRef(null);

    React.useEffect(() => {
        if (typeof indeterminate === 'boolean') {
            ref.current.indeterminate = !rest.checked && indeterminate;
        }
    }, [ref, indeterminate]);

    return (
        <input
            type="checkbox"
            ref={ref}
            className={className + ' cursor-pointer h-5 w-5 accent-PrimaryColors'}
            {...rest}
        />
    );
}

function DatabaseTable({ title, headers, fetchingPath, search }) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [dataFromSearch, setDataFromSearch] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const columnHelper = createColumnHelper();
    const [columnResizeMode, setColumnResizeMode] = useState('onChange');
    const [columnResizeDirection, setColumnResizeDirection] = useState('ltr');
    const [onDialogOpen, setOnDialogOpen] = useState(false);
    const [editData, setEditData] = useState([]);
    const [deleteData, setDeleteData] = useState([]);
    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            [{ align: [] }],
            [{ color: [] }],
            ['code-block'],
            ['clean'],
        ],
        clipboard: {
            matchVisual: false
        }
    };
    const quillFormats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'link',
        'image',
        'align',
        'color',
        'code-block',
    ];
    const onDialogToggle = () => {
        setOnDialogOpen(!onDialogOpen);
        console.log(onDialogOpen);
    }

    const onDataDelete = async (path, id) => {
        try {
            console.log(id)
            if (id) await axios.delete(`/api/${path}?id=${id}`);
            else throw new Error('params is undefined');
        } catch (error) {
            onSweetAlert('Update Error', error.message, 'error');
        }
    }

    useEffect(() => {
        deleteData ? onDataDeleteAlert() : null
    }, [deleteData])

    const onDataDeleteAlert = async () => {
        if ( isNaN(deleteData)) {
            const path = String(Object.keys(deleteData)[0]).split('_')[0] === 'type' ? 'medicine_type' : String(Object.keys(deleteData)[0]).split('_')[0]
            const id = await deleteData[Object.keys(deleteData)[0]];
            console.log(id);
            Swal.fire({
                title: "Are you sure for deleting ?",
                showCancelButton: true,
                confirmButtonText: "Delete",
                confirmButtonColor: "#c60f31",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    Swal.fire("Saved!", "", "success");
                    await onDataDelete(path, id);
                }
            });
        }


    }

    const modifierButtons = [
        {
            name: 'Edit', icon: <Icon icon="mdi:edit" style={{ color: 'white' }} />, color: 'modifier flex items-center bg-[#ffcc3d] border-[#ffcc3d] hover:border-[#ffcc3d] hover:text-[#ffcc3d]', behavior: onDialogToggle
        },
        {
            name: 'Delete', icon: <Icon icon="mdi:delete" style={{ color: 'white' }} />, color: 'modifier flex items-center bg-[#c60f31] border-[#c60f31] hover: border-[#c60f31] hover:text-[#c60f31]', behavior: () => { }
        },
    ];
    const columns = [
        {
            id: 'select',
            header: ({ table }) => (
                <IndeterminateCheckbox
                    {...{
                        checked: table.getIsAllRowsSelected(),
                        indeterminate: table.getIsSomeRowsSelected(),
                        onChange: table.getToggleAllRowsSelectedHandler(),
                    }}
                />
            ),
            cell: ({ row }) => (
                <div className="px-1 text-center">
                    <IndeterminateCheckbox
                        {...{
                            checked: row.getIsSelected(),
                            disabled: !row.getCanSelect(),
                            indeterminate: row.getIsSomeSelected(),
                            onChange: row.getToggleSelectedHandler(),
                        }}
                    />
                </div>
            ),
        },
        ...headers.map((name, index) => ({
            ...columnHelper.accessor(name, {
                cell: (item) => (
                    <span className='text-sm'>
                        {String(item.getValue()).length > 20 ? String(item.getValue()).slice(0, 20) + '...' : String(item.getValue())}
                    </span>
                ),
                header: name,
                enableResizing: true,
                size: 180
            }),
        })),
        columnHelper.accessor('Modifier', {
            id: 'Modifier',
            cell: ({ row }) => (
                <div className='flex gap-2 text-[#fff] flex justify-center'>
                    {modifierButtons.map((item, index) => (
                        <button key={index} onClick={async (e) => {
                            e.preventDefault();
                            const data = await row.original;
                            console.log(data);
                            if (item.name === 'Edit') {
                                setEditData(await data);
                            }
                            if (item.name === 'Delete') {
                                setDeleteData(await data);
                            }
                            item.behavior();
                        }} className={item.color}>{item.icon}</button>
                    ))}
                </div>
            ),
            header: () => <span>Modifier</span>,
            footer: info => info.column.id,
        }),
    ];
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

    useEffect(() => { console.log(editData) }, [editData])

    const onEditChange = (name, value) => {
        setEditData((prev) => ({ ...prev, [name]: value }));
        console.log(editData);
    }

    const onUpdateData = async (e) => {
        e.preventDefault();
        try {
            const path = String(Object.keys(editData)[0]).split('_')[0] === 'type' ? 'medicine_type' : String(Object.keys(editData)[0]).split('_')[0]
            await axios.put(`/api/${path}`, editData);
            onSweetAlert('Update Successfully', 'Refresh the page for change', 'success');
        } catch (error) {
            onSweetAlert('Update Error', error.message, 'error');
        }
    }

    return (
        <div className='w-full flex flex-col items-center gap-4'>
            <Dialog style={{ zIndex: 1 }} className='w-full' onClose={onDialogToggle} open={onDialogOpen}>
                <DialogTitle><span className='editTitle'>{String(Object.keys(editData)[0]).split('_')[0][0].toUpperCase() + String(Object.keys(editData)[0]).split('_')[0].slice(1)}</span></DialogTitle>
                <DialogContent className='flex flex-col px-[2rem] py-[1rem] gap-[1rem] w-full' >
                    {
                        editData && Object.keys(editData).map((key, index) => (
                            ['symptom', 'description', 'medicine_usage'].includes(key) ?
                                <QuillEditor
                                    key={index}
                                    id={index}
                                    className='w-full editor'
                                    defaultValue={''}
                                    placeholder={key}
                                    value={editData[key]}
                                    modules={quillModules}
                                    formats={quillFormats}
                                    onChange={(value) => onEditChange(key, value)}
                                    name={key}
                                />
                                :
                                <TextField onChange={(e) => onEditChange(e.target.name, e.target.value)} label={key} variant="standard" name={key} key={index} value={editData[key]} />
                        ))
                    }
                </DialogContent>
                <DialogActions style={{ fontWeight: 'bold' }}>
                    <Button onClick={onUpdateData}>Update</Button>
                    <Button onClick={onDialogToggle}>Cancel</Button>
                </DialogActions>
            </Dialog>

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
                            <td colSpan={12}>No Record Found!</td>
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
