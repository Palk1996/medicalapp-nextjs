"use client"
import React, { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { Icon } from '@iconify/react';
import { Select, SelectItem } from "@tremor/react";
import Link from 'next/link';
import Profile from './Profile';

const ColorSelector = () => {
    const colorPalette = [
        {
            primaryColor: "",
            secondaryColor: "",
            backgroundColor: ""
        },
        {
            primaryColor: "",
            secondaryColor: "",
            backgroundColor: ""
        },
        {
            primaryColor: "",
            secondaryColor: "",
            backgroundColor: ""
        },
        {
            primaryColor: "",
            secondaryColor: "",
            backgroundColor: ""
        },
    ]
    return (
        <>
            <Select enableClear={false} placeholder='Theme'>
                <SelectItem value="1" >
                    Kilometers
                </SelectItem>
                <SelectItem value="2" >
                    Meters
                </SelectItem>
                <SelectItem value="3" >
                    Miles
                </SelectItem>
                <SelectItem value="4">
                    Nautical Miles
                </SelectItem>
            </Select>
        </>
    );
}

function Navbar() {
    const { theme } = useTheme();
    const [activePage, setActivePage] = useState(0);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navMenus = [
        {
            content: "Home",
            path: "/",
            doActive: () => handleSetActivePage(0)
        },
        {
            content: "Information",
            path: "/information",
            doActive: () => handleSetActivePage(1)
        },
        {
            content: "Dashboard",
            path: "/dashboard",
            doActive: () => handleSetActivePage(2)
        },
        {
            content: "About",
            path: "/about",
            doActive: () => handleSetActivePage(3)
        },
        {
            content: <ColorSelector />,
            path: "#",
            doActive: () => handleSetActivePage(4)
        },
        {
            content: <div className='flex items-center'><Icon className='text-xl' icon="mdi:code" />API</div>,
            path: "/api",
            doActive: () => handleSetActivePage(5)
        },
        {
            content: "Sign In",
            path: "/signin",
            doActive: () => handleSetActivePage(6)
        }
    ]
    useEffect(() => {
        const storedActivePage = sessionStorage.getItem('activePage');
        const getUser = JSON.parse(sessionStorage.getItem('user'));
        if(getUser){
            setUser(getUser)
            console.log(user)
        }
        if (storedActivePage) {
            setActivePage(parseInt(storedActivePage, 10));
        }
    }, []);

    useEffect(()=>{
        console.log(user);
    },[user])


    const handleSetActivePage = (index) => {
        setActivePage(index);
        sessionStorage.setItem('activePage', index.toString());
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className={`flex items-center justify-around max-md:justify-between p-4 w-screen bg-transparent border-[#c3c3c3] border-b`}>
            <div className={`text-black text-lg font-bold`}>
                <a href="/" className='flex items-center space-x-2 '>
                    <Icon icon="fa6-solid:kit-medical" style={{ color: theme.primaryColor }} /> <span>MEDICINAL</span>
                </a>
            </div>
            <div className="hidden md:flex">
                <ul className='flex space-x-5 items-center text-lg font-bold'>
                    {navMenus.map((menu, index) => (
                        user && menu.content === 'Sign In' ? <li key={index}><Profile {...user} /></li> 
                        : 
                        (user?.role === 'creator' || user == null) && menu.content === 'Dashboard' ? null
                        :
                        <li key={index}><Link onClick={menu.doActive} href={menu.path} className='hover:text-white' style={{ color: activePage === index ? theme.primaryColor : '#6c6c6c' }}>{menu.content}</Link></li>
                    ))}
                </ul>
            </div>
            <div className="md:hidden">
                <button onClick={toggleMobileMenu} className="text-2xl focus:outline-none">
                    ☰
                </button>
                {isMobileMenuOpen && (
                    <ul className="absolute top-16 left-0 right-0 bg-white flex flex-col items-center space-y-2 p-4">
                        {navMenus.map((menu, index) => (
                            user && menu.content === 'Sign In' ? <li key={index}><Profile  {...user} /></li> 
                            :
                            (user?.role === 'creator' || user == null) && menu.content === 'Dashboard' ? null
                            :
                            <li key={index}><Link onClick={() => { toggleMobileMenu(); menu.doActive(); }} href={menu.path} className='hover:text-black'>{menu.content}</Link></li>
                        ))}
                    </ul>
                )}
            </div>
        </nav>
    )
}

export default Navbar