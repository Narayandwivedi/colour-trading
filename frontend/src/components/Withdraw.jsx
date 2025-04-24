import React from 'react'

const Withdraw = () => {
  return (
    <div className='h-screen bg-blue-100 pt-5'>
        
        <div className=' bg-gradient-to-r from-red-600 to-red-400 pb-16 rounded-md mx-2'>
            {/* available balance */}
            <div className='flex items-center gap-2 px-4 pt-2'>
            <i class=" text-yellow-400 fa-solid fa-wallet"></i>  
            <p className='text-white'>Available balance</p>
        </div>

                {/*  */}
        <div className='pl-6 flex items-center gap-3'>
            <h2 className='text-2xl text-white font-semibold'>₹0.07</h2>
            <i class=" text-white font-[20px] fa-solid fa-arrows-rotate"></i>
        </div>
            
    </div>
        
        {/* add balance */}

        <div className='p-4 bg-white mx-2 mt-4 flex flex-col items-center'>
                <button className='text-5xl px-3 font-light text-gray-400 border border-dashed border-gray-400'>+</button>
                <p className='text-gray-400 mt-3'>Add bank account number</p>
        </div>

         {/*enter withdraw amount  */}
        <div className='p-4 bg-white mx-2 mt-4 flex flex-col items-center'>
            <input className='bg-blue-100 text-red-500 placeholder-red-500 w-full text-center py-2 rounded-full'  placeholder='please enter the amount' type="text" name="" id="" />
            <button className='bg-gradient-to-r from-red-500 to-red-300 px-4 py-2 mt-3 rounded-md'>withdraw</button>
        </div> 
        
    </div>
  )
}

export default Withdraw