import React, {useState} from 'react';
import {Header, Footer} from './components';
import {Web3ReactProvider} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import ConnectModal from "./components/ConnectModal";
import NftHomepage from "./components/NftHomepage";
import Route from "./components/Route";

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
                <Route path={'/test'}>
                    <h1>TEST</h1>
                </Route>
                <Route path={'/test2'}>
                    <h1>TEST2</h1>
                </Route>
                <ConnectModal open={open} setOpen={setOpen}/>
                <Footer/>
            </div>
        </Web3ReactProvider>
    );

}

export default App;
