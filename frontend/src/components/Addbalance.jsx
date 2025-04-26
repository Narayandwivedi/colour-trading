import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios';
import { toast } from 'react-toastify';


const Addbalance = () => {
  const {userData , BACKEND_URL} = useContext(AppContext)
  const [Utr , setUtr] = useState(null);
  
  async function handelAddTransaction() {
    if(!userData){
        return toast.error("please login to continue")
    }

    if(!Utr){
      return toast.error("please enter utr number")
    }
   try{
    await axios.post(`${BACKEND_URL}/api/transaction`,{
      userId : userData._id,
      UTR: Utr
    })
   }catch(err){
    toast.error("some error in sending utr")
   }
  }
  
  return (
    <div>
        <div>
            <img src="/qr.jpg" alt="" />
            <div className='flex flex-col items-center gap-3 mt-10 '>
                <label htmlFor="">Enter UTR</label>
                <input onChange={(e)=>{setUtr(e.target.value)}} value={Utr} className='outline-none border w-[300px]' type="number" name="" id="" />
                <button onClick={handelAddTransaction} className='bg-cyan-500 py-2 px-4 rounded-md text-white mb-5'>submit</button>
            </div>
        </div>
    </div>
  )
}

export default Addbalance