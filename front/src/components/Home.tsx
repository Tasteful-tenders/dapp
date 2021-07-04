import React, {useContext} from "react";
import {TastefulData} from "../context";
import {TenderCard} from "./TenderCard";

function Home(): JSX.Element {
    const context = useContext(TastefulData);
    const {tenders, nftsData} = context;

    return (
        <div className={"grid grid-cols-5 gap-4"}>
            {tenders && tenders.map((tender, index) => {
                return <TenderCard tender={tender} nftData={nftsData[index]} key={index}/>
            })}
        </div>
    );
}

export default Home;