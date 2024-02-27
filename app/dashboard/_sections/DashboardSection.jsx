import React, { useState, useEffect, Suspense } from 'react';
import { Card } from '@tremor/react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import { Icon } from '@iconify/react';
import { Divider } from '@tremor/react';

const fetchData = () => axios.get('/api/dashboard').then(response => {
    response.data.result.forEach((val, index) => console.log(val[0]))
    return response.data.result
}).catch(error => {
    console.error('Error fetching data:', error);
    return null;
});

const DashboardSection = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchData().then(result => setData(result));
    }, []);
    const dataKey = [
        {
            key: "disease",
            icon: <Icon height={50} icon="fa6-solid:disease" />
        },
        {
            key: "medicine",
            icon: <Icon height={50} icon="ph:pill-fill" />
        },
        {
            key: "medicine_type",
            icon: <Icon height={50} icon="material-symbols:category" />
        },
        {
            key: "admin",
            icon: <Icon height={50} icon="eos-icons:admin" />
        },
    ];
    return (
        <section className='flex flex-col'>
            <span className='text-2xl text-center mt-6 font-bold text-[#00ADB5]'>Number of table</span>
            <div className='grid grid-cols-4 gap-3 m-6'>
                <AnimatePresence>
                    {data && data.map((item, index) => (
                        <motion.div
                            key={index} // Using a more unique key
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeInOut' }}
                            custom={index}
                        >
                            <Suspense fallback={<div>Loading...</div>}>
                                <Card
                                    decoration="top"
                                    decorationColor='green'
                                    className='flex flex-col'
                                >
                                    <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">{dataKey[index].key.toLocaleUpperCase()}</p>
                                    <Divider>Infomation</Divider>
                                    <div className='flex items-center justify-between'>
                                        {dataKey[index].icon}
                                        <span className='font-bold text-xl'>{item[0][dataKey[index].key]} rows</span>
                                    </div>
                                    
                                </Card>
                            </Suspense>

                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

        </section>
    );
};

export default DashboardSection;
