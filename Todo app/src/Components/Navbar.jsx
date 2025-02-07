export default function Navbar(){
    return (
       <nav className="shadow mb-5 sm:px-6 flex justify-between">
        <div className="logo p-2">
            <h3 className="font-bold text-purple-500">I-Task</h3>
        </div>
        <ul className="flex gap-10 p-2 ml-4 text-gray-700 ">
            <li><a style={{fontSize:"10.5px"}} className=" hover:text-black " href="">Home</a></li>
            <li><a style={{fontSize:"10.5px"}} className=" hover:text-black " href="">About us</a></li>
            <li><a style={{fontSize:"10.5px"}} className=" hover:text-black " href="">Contact us</a></li>
            <li><a style={{fontSize:"10.5px"}} className=" hover:text-black hidden sm:inline-block " href="">More apps</a></li>
        </ul>
       </nav>
    ) 
}