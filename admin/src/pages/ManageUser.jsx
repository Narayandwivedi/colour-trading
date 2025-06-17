import React from 'react'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const ManageUser = () => {
  const {BACKEND_URL} = useContext(AppContext)
  const [user , setUser] = useState([])

  async function fetchAllUser() {
    try{
     const {data} =  await axios.get(`${BACKEND_URL}/api/admin/allusers`)
     if(data.success){
      setUser(data.allUser)
     }
    }catch(err){
      toast.error(err.message)
    }
  }

  useEffect(()=>{

  },[])
  
  return (
    <div>ManageUser</div>
  )
}

export default ManageUser