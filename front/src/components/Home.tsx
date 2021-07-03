import React, {useContext} from "react";
import {TastefulData} from "../context";
import {TenderCard} from "./TenderCard";

function Home(): JSX.Element {
    const context = useContext(TastefulData);
    const {tenders, nftsData} = context;

    return (
        <div className={"grid grid-cols-3 gap-4"}>
            {tenders && tenders.map((tender, index) => {
                return (
                    <div key={index}>
                        <TenderCard tender={tender} nftData={nftsData[index]} />
                    </div>
                );
            })}
        </div>
    );
}

export default Home;