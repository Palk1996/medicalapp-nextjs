import React from 'react'
import { Divider } from '@tremor/react'
function ReportCard(props) {
  return (
    <div className='bg-white flex p-4 flex-col'>
        <div className='mx-4'>
            <span>{props.content}</span>
        </div>
        <Divider className='my-1'>Description</Divider>
        <div className='mx-4'>
            <p className='indent-8'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Possimus eius blanditiis cupiditate! Maxime rerum ad veritatis natus ab omnis, nisi quod vitae fugiat officia architecto quibusdam laudantium inventore quae iusto?</p>
        </div>
    </div>
  )
}

export default ReportCard