import React from "react";
import Header from "../components/Header/FeedHeader";

export default function FeedWithHeaderLayout({ children }) {
    return (
        <>

            <Header />
            <div className="content"> 


                {children} 



            </div>
        
        </>
    );
};
