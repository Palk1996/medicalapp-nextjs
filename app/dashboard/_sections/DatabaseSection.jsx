import React, { useState } from 'react'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@tremor/react";
import { useTheme } from '@/app/contexts/ThemeContext';
import { Icon } from '@iconify/react';
import DatabaseTable from '../_components/DatabaseTable';
import { motion } from 'framer-motion';

function DatabaseSection() {
  const { theme } = useTheme();
  const [search, setSearch] = useState('');
  let tabsNumber = 0;
  const databaseHeader = [
    {
      title: "Disease",
      headers: ["disease_id", "disease_name_th", "disease_name_en", "description", "symptom", "medicine_id", "medicine_usage"],
      fetchingPath: "/api/disease",
    },
    {
      title: "Medicine",
      headers: ["medicine_id", "medicine_name", "type_id"],
      fetchingPath: "/api/medicine",
    },
    {
      title: "Medicine Type",
      headers: ["type_id", "type_name"],
      fetchingPath: "/api/medicine_type",
    },
    {
      title: "Admin",
      headers: ["admin_id", "username", "first_name", "last_name", "password", "email", "telephone", "gender", "birthdate", "role", "status"],
      fetchingPath: "/api/admin",
    },
  ];

  const tabHeader = [
    {
      label: "Disease",
      icon: <Icon icon="fa6-solid:disease" />
    },
    {
      label: "Medicine",
      icon: <Icon icon="ph:pill-fill" />
    },
    {
      label: "Medicine_Type",
      icon: <Icon icon="material-symbols:category" />
    },
    {
      label: "Admin",
      icon: <Icon icon="eos-icons:admin" />
    },
  ];

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.1, ease: 'easeInOut' }}
      className='m-6 bg-white w-[97%]'>
      <div className='p-6 flex flex-col'>
        <span className='text-2xl font-bold' style={{ color: theme.primaryColor }}>Database Section</span>
        <TabGroup onIndexChange={(index) => tabsNumber = index}>
          <div className='flex justify-between items-center'>
            <TabList className="mt-8">
              {tabHeader.map((item, index) => (
                <Tab className='h-[3rem]' key={index}><div className='text-lg space-x-2 flex flex-row items-center'>{item.icon}<span>{item.label}</span></div></Tab>
              ))}
            </TabList>
            <input onChange={onSearchChange} type="text" className='mt-8 h-[2rem]'/>
          </div>

          <TabPanels>
            {
              databaseHeader.map((item, index) => (
                <TabPanel key={index}>
                  <div className="mt-10">
                    <DatabaseTable {...item} search={search} />
                  </div>
                </TabPanel>
              ))
            }
          </TabPanels>
        </TabGroup>
      </div>
    </motion.section>
  )
}

export default DatabaseSection