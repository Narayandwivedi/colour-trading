import { createContext, useEffect, useState } from "react";
import axios from "axios"

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    // const BACKEND_URL = `http://localhost:8080`;
    // const BACKEND_URL = `http://168.231.120.131:8080`;
     const BACKEND_URL = `http://winnersclubs.fun:8080`;
     const [stats , setStats] = useState('')

     const fetchStats = async()=>{

        try{
            const {data} = await axios.get(`${BACKEND_URL}/api/admin/stats`)
            setStats(data) 
        }catch(err){
            console.log('error fetching stats');
            
        }
     }

     useEffect(()=>{
        fetchStats()
     },[])

    const value = {
        BACKEND_URL,
        stats
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
