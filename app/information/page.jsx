"use client"
import React, { useState, useEffect } from 'react';
import famousDisease from './famousDisease';
import DiseaseCard from '../components/DiseaseCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { Icon } from '@iconify/react';
import MiniCard from '../components/MiniCard';
import { Skeleton } from '@mui/material';
import { Button, Dialog, DialogPanel, Title } from "@tremor/react";
import {
    TabGroup,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
} from "@tremor/react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function Information() {
    const [data, setData] = useState([]);
    const [diseaseData, setDiseaseData] = useState({});
    const [input, setInput] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [showSearchDropdown, setSearchShowDropdown] = useState(true);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();

    const onSearchValueChange = (value) => {
        setInput(value);
        fetchOnSearchValue(value);
        setSearchShowDropdown(true);
    }

    const onDiseaseCardPopUp = (data) => {
        setIsOpen(true);
        setDiseaseData({ ...data });
    }

    const fetchOnSearchValue = (value) => {
        const filtered = data.filter((item) =>
            item.disease_name_th.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
        console.log(filteredData)
    };

    const handleDropdownItemClick = (value) => {
        setInput(value);
        setSearchShowDropdown(false);
    };

    const handleInputBlur = () => {
        // Delay the closing of the dropdown to allow time for handleDropdownItemClick to execute
        setTimeout(() => setSearchShowDropdown(false), 200);
    };

    useEffect(() => {
        const fetchData = () => {
            setTimeout(async () => {
                try {
                    const response = await fetch('/api/disease');
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
        console.log(diseaseData);
    }, [diseaseData]);

    return (
        <div className='w-full min-h-screen flex flex-col space-y-5'>
            <div className='mx-4 md:mx-12 mt-6 md:mt-12'>
                <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold'>
                    #5 อันดับโรคร้ายที่คนไทยเสี่ยงเป็นและ<span style={{ color: theme.primaryColor }}>เสียชีวิต</span>
                </h1>
            </div>
            <div className='mx-4 md:mx-12 flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-2 justify-center'>
                <AnimatePresence>
                    {famousDisease.map((item, index) => (
                        <motion.div
                            className='w-full xl:w-1/3'
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeInOut' }}
                            custom={index}
                        >
                            <DiseaseCard {...item} index={index} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            <div className='mx-4 md:mx-12 my-6 md:my-12 flex flex-col'>
                <div className='flex flex-col md:flex-row justify-between items-center'>
                    <div className='flex items-center space-x-6'>
                        <h1 className='text-xl md:text-2xl lg:text-3xl font-bold'>
                            Disease <span style={{ color: theme.primaryColor }}>Finder</span>
                        </h1>
                        <div className='flex'>
                            <button><Icon icon="ion:filter" /></button>
                        </div>
                    </div>

                    <div className='flex items-center mt-4 md:mt-0'>
                        <div className='flex flex-col'>
                            <input
                                onChange={(e) => onSearchValueChange(e.target.value)}
                                onBlur={handleInputBlur}
                                placeholder='Search...'
                                className='w-full md:w-[25rem] search-input'
                                type='search'
                                name='Search'
                                autoComplete="off"
                                value={input}
                            />
                            {showSearchDropdown && filteredData.length > 0 && (
                                <div className='w-full md:w-[25rem] h-[10rem] bg-white absolute md:translate-y-[2.5rem] overflow-y-auto'>
                                    {filteredData.map((item, index) => (
                                        <div
                                            onClick={() => handleDropdownItemClick(item.disease_name_th)}
                                            key={index}
                                            className='cursor-pointer border p-2 hover:bg-gray-200'
                                        >
                                            {item.disease_name_th}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button className='text-white p-3 rounded-r-2xl border md:ml-0 h-[2.5rem]' style={{ backgroundColor: theme.primaryColor, borderColor: theme.primaryColor }}><Icon icon="carbon:search" /></button>
                    </div>
                </div>
            </div>

            <div className='mx-4 md:mx-12 my-6 md:my-12 flex flex-col h-max'>
                <div className='grid max-md:grid-cols-1 max-lg:grid-cols-5 lg:grid-cols-7 my-4 gap-3'>
                    <AnimatePresence>
                        {loading ? (
                            Array.from({ length: data.length }, (_, index) => (
                                <motion.div
                                    className='cursor-pointer'
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5, ease: 'easeOut' }}
                                >
                                    <div className='flex flex-col border bg-white border-[#c3c3c3] rounded-md'>
                                        <div className='m-2 flex flex-col'>
                                            <div className='text-lg px-4'>
                                                <Skeleton animation="wave" width={100} />
                                            </div>
                                            <div className='indent-3 font-thin px-4 text-sm'>
                                                <Skeleton animation="wave" height={20} />
                                                <Skeleton animation="wave" height={20} />
                                                <Skeleton animation="wave" height={20} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (input !== "" ? (
                            filteredData.length === 0 && input !== "" ? (
                                <div className='col-span-7 md:col-span-7 flex flex-col items-center space-y-4'>
                                    <Icon style={{ color: theme.primaryColor }} className='text-5xl md:text-7xl' icon="nonicons:not-found-16" />
                                    <h1 className='text-lg md:text-2xl'>No results <span style={{ color: theme.primaryColor }}>found</span></h1>
                                </div>
                            ) : (
                                filteredData.map((item, index) => (
                                    <motion.div
                                        className='cursor-pointer'
                                        onClick={() => onDiseaseCardPopUp(item)}
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        transition={{ duration: 0, delay: index * 0.01, ease: 'easeInOut' }}
                                        custom={index}
                                    >
                                        <MiniCard index={index + 1} {...item} />
                                    </motion.div>
                                ))
                            )
                        ) : (
                            data.slice(0, 30).map((item, index) => (
                                <motion.div
                                    className='cursor-pointer'
                                    key={index}
                                    onClick={() => onDiseaseCardPopUp(item)}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.5, delay: index * 0.01, ease: 'easeInOut' }}
                                    custom={index}
                                >
                                    <MiniCard index={index + 1} {...item} />
                                </motion.div>
                            ))
                        ))

                        }

                    </AnimatePresence>
                </div>
            </div>
            <Dialog className='w-[20rem]' open={isOpen} onClose={(val) => { }} static={false}>
                <DialogPanel>
                    <Title className="mb-3 font-bold" style={{color: theme.primaryColor}}>{diseaseData.disease_name_en}</Title>
                    <TabGroup>
                        <TabList className="mt-8">
                            {
                                Object.keys(diseaseData).map((item, index) => (
                                    ['medicine_usage', 'symptom', 'description'].includes(item) && <Tab key={index}>{item}</Tab>
                                ))
                            }
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <div className="mt-10">
                                    <ReactQuill
                                        className='h-[20rem] text-3xl w-full editor'
                                        value={diseaseData.description}
                                        readOnly={true}
                                        theme={'bubble'}
                                    />

                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div className="mt-10">
                                    <ReactQuill
                                        className='h-[20rem] w-full editor'
                                        value={diseaseData.symptom}
                                        readOnly={true}
                                        theme={'bubble'}
                                    />

                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div className="mt-10">
                                    <ReactQuill
                                        className='h-[20rem] w-full editor'
                                        value={diseaseData.medicine_usage}
                                        readOnly={true}
                                        theme={'bubble'}                                      
                                    />
                                </div>
                            </TabPanel>
                        </TabPanels>
                    </TabGroup>
                    <div className="mt-3">
                        <button style={{color: theme.primaryColor}} onClick={() => setIsOpen(false)}>
                            Close
                        </button>
                    </div>
                </DialogPanel>
            </Dialog>
        </div>
    );
}

export default Information;
