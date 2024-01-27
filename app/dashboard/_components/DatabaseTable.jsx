import React, { useEffect, useState } from 'react';
import { Card, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Title } from "@tremor/react";
import { Icon } from '@iconify/react';
import { Skeleton } from '@mui/material';
import Pagination from '@/app/components/Pagination';

function DatabaseTable({ title, headers, fetchingPath }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const totalPages = 3;

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

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <Card>
            <Title className='flex items-center text-lg font-bold'><Icon icon="tabler:table-filled" /> {title} Table</Title>
            <Table className="mt-5">
                <TableHead>
                    <TableRow>
                        {headers.map((item, index) => (
                            <TableHeaderCell className='text-md' key={index}>{item}</TableHeaderCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? (
                        Array.from({ length: 6}, (_, index) => (
                            <TableRow key={index} className={` ${index % 2 === 1 ? 'bg-[transparent]' : ' bg-slate-100'} border-none !text-PrimaryColors hover:!text-InactivePrimary cursor-pointer`}>
                                {headers.map((_, cellIndex) => (
                                    <TableCell key={cellIndex}>
                                        <Skeleton animation="wave" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        // Render the actual data
                        data.map((rowData, index) => (
                            <TableRow key={index} className={` ${index % 2 === 1 ? 'bg-[transparent]' : ' bg-slate-100'} border-none !text-PrimaryColors hover:!text-InactivePrimary cursor-pointer`}>
                                {headers.map((header, cellIndex) => (
                                    <TableCell key={cellIndex}>{typeof rowData[header] === 'string' && rowData[header].length > 15 ? `${rowData[header].slice(0, 25)}...` : rowData[header]}</TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </Card>
    );
}

export default DatabaseTable;
