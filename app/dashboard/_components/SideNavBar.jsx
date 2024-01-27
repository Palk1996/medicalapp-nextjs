import React from 'react';
import { Icon } from '@iconify/react';
import { useTheme } from '@/app/contexts/ThemeContext';
import { motion } from 'framer-motion';

function SideNavBar(props) {
    const { theme } = useTheme();
    const navMenus = [
        {
            content: "Dashboard",
            icon: <Icon icon="material-symbols:dashboard" />,
            function: () => props.function(0)
        },
        {
            content: "Database",
            icon: <Icon icon="mdi:database" />,
            function: () => props.function(1)
        },
    ];

    return (
        <motion.nav
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeInOut' }}
            className={`bg-white ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            <div className='flex flex-col space-y-4'>

                {/* Responsive Upload Button */}
                <div className='text-center mt-4 m-auto'>
                    <button className='py-3 px-6 text-lg space-x-2 flex items-center rounded-md'
                        style={{ backgroundColor: theme.primaryColor, color: "#ffffff" }}
                        onClick={props.showUploadFunction}
                    >
                        <Icon icon="ph:plus-fill" /> <span>Upload</span>
                    </button>
                </div>

                {/* Responsive Navigation Menu */}
                <ul className='flex flex-col'>
                    <div className='h-[1px] bg-slate-300 mx-3'></div>
                    {navMenus.map((item, index) => (
                        <li
                            onClick={item.function}
                            style={{ color: (props.section) === index ? theme.primaryColor : null }}
                            className='cursor-pointer p-4 flex items-center space-x-2 text-lg hover:bg-slate-100' key={index}>
                            {item.icon}<span>{item.content}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </motion.nav>
    );
}

export default SideNavBar;
