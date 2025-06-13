import { createContext } from "react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    // const BACKEND_URL = `http://localhost:8080`;
    const BACKEND_URL = `http://168.231.120.131:8080`;
    const value = {
        BACKEND_URL
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
