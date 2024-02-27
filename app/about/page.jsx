import React from 'react'
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Tooltip from '@mui/material/Tooltip';

function About() {
  return (
    <div className='w-full h-full flex flex-col gap-6 items-center p-6'>
      <div>
        <span className='text-3xl text-[#00ADB5] '>About Us</span>
      </div>
      <div>
        <AvatarGroup>
          <Tooltip title='Manisorn Samankul'>
            <Avatar className='bg-[#00ADB5] cursor-pointer'>Pr</Avatar>
          </Tooltip >
          <Tooltip title='Sukanya Chareonphol'>
            <Avatar className='bg-[#00ADB5] cursor-pointer'>Me</Avatar>
          </Tooltip>
          <Tooltip title='Nicha Pintong'>
            <Avatar className='bg-[#00ADB5] cursor-pointer'>Be</Avatar>
          </Tooltip>
        </AvatarGroup>
      </div>
      <div className='w-1/2'>
        <p className='indent-12'>Welcome to [Your Company Name]!

          At [Your Company Name], we are passionate about [describe your mission or the problem you're solving]. Founded in [year of establishment], we have been dedicated to [your main goal or purpose] ever since.<br />

          Our journey began with a simple idea: [briefly mention the inspiration or motivation behind starting the company]. Since then, we have grown into a [mention your scale or reach, e.g., global, national, regional] [industry/sector] leader, serving [mention your target audience or customer base].<br />

          What sets us apart is our commitment to [highlight your unique selling proposition, e.g., innovation, quality, customer service]. We strive to [mention your core values or principles], ensuring that every interaction with us is [describe the desired experience, e.g., seamless, enjoyable, efficient].<br />

          At [Your Company Name], our team is our greatest asset. We are a diverse group of individuals, united by our passion for [mention the industry or field], and dedicated to [mention your shared goal or vision]. Together, we work tirelessly to [mention the impact or change you aim to make].<br />

          Whether you're a [mention your target audience, e.g., consumer, business, organization], we are here to [mention the value you provide, e.g., support your needs, help you succeed]. Your satisfaction is our priority, and we are constantly striving to exceed your expectations.<br />

          Thank you for choosing [Your Company Name]. We look forward to serving you and building a brighter future together.<br />
          <br />
          Sincerely,
          <br />
          [Your Name or Company Founder]
          <br />
          [Your Position]
          <br />
          [Your Company Name]
        </p>
      </div>
    </div>
  )
}

export default About