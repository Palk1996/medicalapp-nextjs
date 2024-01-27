import React from 'react'

function MiniCard({disease_name_th, description, index}) {
  return (
    <div className='flex flex-col border bg-white border-[#c3c3c3] rounded-md'>
        <div className='m-2 flex flex-col'>
            <div className='text-lg px-4'>
                {index} {disease_name_th}
            </div>
        </div>
    </div>
  )
}

export default MiniCard