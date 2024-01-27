"use client"
import React, { useState, useEffect } from 'react'
import SideNavBar from './_components/SideNavBar'
import DatabaseSection from './_sections/DatabaseSection';
import DashboardSection from './_sections/DashboardSection';
import UploadModal from './_components/UploadModal';

function Dashboard() {
    const [section, setSection] = useState(0);
    const [showUpload, setShowUpload] = useState(false);
    const sectionList = [<DashboardSection />, <DatabaseSection />];
    const sectionSwitcher = (section) => {
        setSection(section);
    };
    const showUploadHandler = () => {
        setShowUpload(!showUpload);
    };

    return (
        <div className=' grid grid-cols-7 bg-slate-100'>
            <SideNavBar showUploadFunction={showUploadHandler} function={sectionSwitcher} section={section} />
            {showUpload ? <UploadModal showUploadFunction={showUploadHandler} /> : null}
            <div className=' col-span-6 overflow-y-hidden'>
                {sectionList[section]}
            </div>
        </div>

    )
}

export default Dashboard