import React from 'react'

const Addbalance = () => {
  return (
    <div>
        <div>
            <img src="/qr.jpg" alt="" />
            <div className='flex flex-col items-center gap-3 mt-10 '>
                <label htmlFor="">Enter UTR</label>
                <input className='outline-none border w-[300px]' type="number" name="" id="" />
                <button className='bg-cyan-500 py-2 px-4 rounded-md text-white mb-5'>submit</button>
            </div>
        </div>
    </div>
  )
}

export default Addbalance