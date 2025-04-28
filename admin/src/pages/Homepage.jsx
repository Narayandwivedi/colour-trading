import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Card from '../components/Card'

const Homepage = () => {
  return (
    <div className='m-10 flex gap-2'>
      <Card heading={"Total Users"} data={150}/>
      <Card heading={"Total Users"} data={150}/>
      <Card heading={"Total Users"} data={150}/>
    </div>
  )
}

export default Homepage