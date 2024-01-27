import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

function DiseaseCard({ head, info, index }) {
    const { theme } = useTheme();

    return (
        <div className='flex border border-[#c3c3c3] rounded-md'>
            <div className='flex flex-col'>
                <div className='p-2 md:p-4 flex flex-col md:flex-row justify-between items-center'>
                    <span className='text-xs md:text-sm font-bold p-1 md:p-2 rounded-md text-white' style={{ backgroundColor: theme.primaryColor }}>
                        อันดับ {index + 1}
                    </span>
                    <span className='text-lg md:text-xl font-bold mt-2 md:mt-0'>{head}</span>
                </div>
                <div className='mx-1 h-[1px]' style={{ backgroundColor: theme.primaryColor }}></div>
                <div className='p-2 md:p-4'>
                    <p className='indent-12 text-sm md:text-md'>{info}</p>
                </div>
            </div>
        </div>
    );
}

export default DiseaseCard;