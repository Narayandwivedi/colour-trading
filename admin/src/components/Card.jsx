import React from 'react'

const Card = ({heading , data}) => {
  return (
    <div className='bg-black py-2 h-[90px] w-[130px] rounded-md pl-2 hover:scale-105 transition-all duration-500'>
        <h1 className='font-semibold text-white'>{heading}</h1>
        <p className='text-gray-300'>{data}</p>
    </div>
  )
}

export default Card