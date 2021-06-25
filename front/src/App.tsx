import React, {useState} from 'react';
import {Header, Footer} from './components';
import {Web3ReactProvider} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import ConnectModal from "./components/ConnectModal";

function getLibrary(provider: any) {
    const library = new Web3Provider(provider)
    library.pollingInterval = 12000
    return library
}

function App(): JSX.Element {
    const [open, setOpen]: [open: boolean, setOpen: Function] = useState(false);

    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <div className="App">
                <Header setOpen={setOpen}/>
                {/* <Caroussel /> */}
                <ConnectModal open={open} setOpen={setOpen}/>
                <Footer/>
            </div>
        </Web3ReactProvider>
    );

}

export default App;
