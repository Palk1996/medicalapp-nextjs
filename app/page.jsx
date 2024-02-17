"use client"
import { useEffect } from "react";
import { useTheme } from "./contexts/ThemeContext";
import Image from "next/image";
import mainImage from "./assets/images/mainContentImage.png";
import { Icon } from '@iconify/react';
import { motion } from "framer-motion";
export default function Home() {
  const { theme } = useTheme();
  const listContent = [
    {
      title: "Fast Response",
      icon: <Icon icon="typcn:flash" />,
      text: "Receive our information as fast as possible."
    },
    {
      title: "Correct Information",
      icon: <Icon icon="mdi:success-bold" />,
      text: "Our information is most researched from real hospital."
    },
    {
      title: "Free API",
      icon: <Icon icon="mdi:code" />,
      text: "You can fetch directing to our api page for information."
    },
    {
      title: "Privacy",
      icon: <Icon icon="ic:baseline-privacy-tip" />,
      text: "We never received any user information."
    },
  ];

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className={`h-[65vh] flex flex-col space-y-3 m-24 items-center ${theme.backgroundColor}`}>
      <div className="w-[50%]">
        <h1 className="text-4xl font-bold">Do <span style={{ color: theme.primaryColor }}>Healthy</span></h1>
        <p className=" indent-16 text-xl">Welcome to <span style={{ color: theme.primaryColor }} className={`font-bold`}>Medicinal App</span>, where compassion meets expertise in the pursuit of optimal health and well-being. As your trusted online medical resource, we are dedicated to empowering you with accurate information, cutting-edge research, and personalized insights to navigate your unique health journey.</p>
      </div>
      <div className="grid grid-cols-2 w-[50%]">
        {listContent.map((item, index) => (
          <div key={index} className="flex flex-col">
            <div style={{ color: theme.primaryColor }} className={`flex text-lg font-bold space-x-1 items-center`}>
              {item.icon}
              <span>{item.title}</span>
            </div>
            <div>
              <p className="text-md">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div>
        <Image className="mt-14"
          src={mainImage}
          alt="main image"
        />
      </div>

    </motion.main>
  )
}
