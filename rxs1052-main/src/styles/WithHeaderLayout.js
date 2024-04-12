import React from "react";
import Header from "../components/Header/Header";

export default function WithHeaderLayout({ children }) {
    return (
        <>

            <Header />
            <div className="content"> 


                {children} 



            </div>
        
        </>
    );
};
