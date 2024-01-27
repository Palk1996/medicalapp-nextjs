import React from 'react'
import ReportCard from '../_components/ReportCard'
import { AnimatePresence, motion } from 'framer-motion'
function DashboardSection() {
    const content = Array(10).fill("Content")
    return (
        <section className=' grid grid-cols-4 gap-3 m-6'>
            <AnimatePresence>
                {
                    content.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeInOut' }}
                            custom={index}
                        ><ReportCard key={index} content={item} /></motion.div>

                    ))
                }
            </AnimatePresence>
        </section>
    )
}

export default DashboardSection