"use client"
import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

function Footer() {
    const { theme } = useTheme();
    return (
        <footer className='flex justify-center p-4 border-t border-[#c3c3c3]'>
            <div className='font-bold'>
                Medical App <span className={`${theme.primaryColor.split(" ")[0]}`}>@Primary_Prim</span>
            </div>
        </footer>
    )
}

export default Footer