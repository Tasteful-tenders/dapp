import {Transition} from '@headlessui/react';
import Spinner from 'react-spinner-material';

export function TxSentModal({txPending}: { txPending: string }) {

    return (
        <Transition
            show={txPending !== ''}
            enter="transition-opacity duration-75"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className={"bg-white w-confirmation_modal text-center shadow-2xl border rounded-lg absolute top-24 right-2"}>
                <a className={"underline text-light_blue"} href={'https://ropsten.etherscan.io/tx/'+txPending} target={"_blank"}>Transaction sent.</a>
                <h3>Waiting for 3 confirmations...</h3>
                <div className={"pl-32"}>
                    <Spinner radius={40} color={"#333"} stroke={2} visible={true}/>
                </div>
            </div>
        </Transition>
    )
}