import Homepage from "./pages/Homepage"
import { Routes , Route , Link} from "react-router-dom"
import Transaction from "./pages/Transaction"
import { ToastContainer, toast } from 'react-toastify';
import ManageUser from "./pages/ManageUser";
import ManageWithdraw from "./pages/ManageWithdraw";
import LiveBets from "./pages/LiveBets";

function App() {

  return (
    <div className='bg-gray-100 flex '>
    <div className='h-screen w-[300px] bg-white shadow p-5'>
     <div className='flex flex-col gap-3 mt-5'>
     <Link to={"/"}><button className='bg-blue-500 px-3 py-2 rounded-md text-white'>user stats</button></Link>
     <Link to={"/manageusers  "}><button className='bg-blue-500 px-3 py-2 rounded-md text-white'>Manage users</button></Link>
     <Link to={"/withdraw"}><button className='bg-blue-500 px-3 py-2 rounded-md text-white'>Manage withdraw</button></Link>
     <Link to={"/transaction"}><button className='bg-blue-500 px-3 py-2 rounded-md text-white'>Manage transcations</button></Link>
     <Link to={"/livebet"}><button className='bg-blue-500 px-3 py-2 rounded-md text-white'>Manage Bets</button></Link>
     
     
     </div>
    </div>
    <ToastContainer/>
    <Routes>
      <Route path="/" element={<Homepage/>}/>
      <Route path="/transaction" element={<Transaction/>}/>
      <Route path="/manageusers" element={<ManageUser/>}/>
      <Route path="/withdraw" element={<ManageWithdraw/>}/>
      <Route path="/livebet" element={<LiveBets/>}/>
    </Routes>
  </div>
  )
}

export default App
