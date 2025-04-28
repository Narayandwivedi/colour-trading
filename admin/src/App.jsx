import Homepage from "./pages/Homepage"
import { Routes , Route , Link} from "react-router-dom"
import Transaction from "./pages/Transaction"
import { ToastContainer, toast } from 'react-toastify';

function App() {

  return (
    <div className='bg-gray-100 flex'>
    <div className='h-screen w-[300px] bg-white shadow p-5'>
     <div className='flex flex-col gap-3 mt-5'>
     <Link to={"/transaction"}><button className='bg-blue-500 px-3 py-2 rounded-md text-white'>All transcations</button></Link>
     <Link to={"/"}><button className='bg-blue-500 px-3 py-2 rounded-md text-white'>stats</button></Link>
     </div>
    </div>
    <ToastContainer/>
    <Routes>
      <Route path="/" element={<Homepage/>}/>
      <Route path="/transaction" element={<Transaction/>}/>
    </Routes>
  </div>
  )
}

export default App
